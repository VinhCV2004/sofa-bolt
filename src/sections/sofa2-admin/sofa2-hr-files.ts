const DATABASE_NAME = 'sofa2-hr-files';
const DATABASE_VERSION = 1;
const STORE_NAME = 'cv-files';

type StoredHrFile = {
  id: string;
  name: string;
  type: string;
  file: Blob;
  savedAt: string;
};

function openDatabase(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('Trình duyệt này không hỗ trợ lưu tệp CV cục bộ.'));
  }
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) database.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Không mở được kho tệp CV.'));
    request.onblocked = () => reject(new Error('Kho tệp CV đang được sử dụng ở thẻ khác. Hãy tải lại trang rồi thử lại.'));
  });
}

export async function saveSofa2HrCv(applicationId: string, file: File) {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put({
        id: applicationId,
        name: file.name,
        type: file.type || 'application/octet-stream',
        file,
        savedAt: new Date().toISOString(),
      } satisfies StoredHrFile);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('Không lưu được tệp CV.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Đã huỷ lưu tệp CV.'));
    });
  } finally {
    database.close();
  }
}

export async function downloadSofa2HrCv(applicationId: string) {
  const database = await openDatabase();
  let record: StoredHrFile | undefined;
  try {
    record = await new Promise<StoredHrFile | undefined>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(applicationId);
      request.onsuccess = () => resolve(request.result as StoredHrFile | undefined);
      request.onerror = () => reject(request.error ?? new Error('Không đọc được tệp CV.'));
    });
  } finally {
    database.close();
  }
  if (!record) throw new Error('Không tìm thấy tệp CV trên trình duyệt này.');
  const url = URL.createObjectURL(record.file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = record.name;
  anchor.rel = 'noopener';
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function deleteSofa2HrCv(applicationId: string) {
  if (!applicationId || typeof window === 'undefined' || !window.indexedDB) return;
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete(applicationId);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('Không xoá được tệp CV.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Đã huỷ xoá tệp CV.'));
    });
  } finally {
    database.close();
  }
}
