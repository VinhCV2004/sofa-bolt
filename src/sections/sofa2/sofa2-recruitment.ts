type Sofa2JobStatus = { status?: unknown; deadline?: unknown };

const todayIsoDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export function isSofa2JobOpen(job: Sofa2JobStatus) {
  if (String(job.status ?? '') !== 'Đang tuyển') return false;
  const rawDeadline = String(job.deadline ?? '').trim();
  const localized = rawDeadline.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const deadline = localized
    ? `${localized[3]}-${localized[2].padStart(2, '0')}-${localized[1].padStart(2, '0')}`
    : rawDeadline.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(deadline) && deadline >= todayIsoDate();
}
