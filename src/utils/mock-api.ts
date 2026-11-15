import type { IPostItem } from 'src/types/blog';
import type { IProductItem } from 'src/types/product';
import type { IMail, IMailLabel } from 'src/types/mail';
import type { ICalendarEvent } from 'src/types/calendar';
import type { IKanban, IKanbanTask } from 'src/types/kanban';
import type { IChatMessage, IChatParticipant, IChatConversation } from 'src/types/chat';

import { _contacts } from 'src/_mock/_others';

import { SOFA2_PRODUCTS, SOFA2_BLOG_POSTS } from 'src/sections/sofa2/sofa2-pages-data';

type MockRequestConfig = { params?: Record<string, string | number | undefined> };
type MockFetchArgs = string | [string, MockRequestConfig] | (string | MockRequestConfig)[];

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};

const products: IProductItem[] = SOFA2_PRODUCTS.map((product, index) => {
  const salePrice = product.oldPrice ? product.price : null;
  const price = product.oldPrice ?? product.price;
  const saleLabel = product.badge?.includes('%') ? product.badge : '';

  return {
    id: product.id,
    sku: `LX-${product.id.padStart(4, '0')}`,
    name: product.name,
    code: product.slug,
    price,
    taxes: 0,
    tags: product.badge ? [product.badge] : [],
    sizes: product.size ? [product.size] : [],
    publish: 'published',
    gender: [],
    coverUrl: product.image,
    images: product.images,
    colors: product.colors,
    quantity: 24,
    category: product.category,
    available: 18,
    totalSold: product.reviews,
    description: product.description,
    totalRatings: product.reviews,
    totalReviews: product.reviews,
    createdAt: new Date(2025, 0, index + 1).toISOString(),
    inventoryType: 'in stock',
    subDescription: product.material,
    priceSale: salePrice,
    reviews: [],
    ratings: [
      { name: '5 star', starCount: 0.8, reviewCount: Math.round(product.reviews * 0.8) },
      { name: '4 star', starCount: 0.2, reviewCount: Math.round(product.reviews * 0.2) },
      { name: '3 star', starCount: 0, reviewCount: 0 },
      { name: '2 star', starCount: 0, reviewCount: 0 },
      { name: '1 star', starCount: 0, reviewCount: 0 },
    ],
    saleLabel: { enabled: !!saleLabel, content: saleLabel },
    newLabel: { enabled: product.badge === 'Mới', content: 'Mới' },
  };
});

const posts: IPostItem[] = SOFA2_BLOG_POSTS.map((post, index) => ({
  id: post.id,
  title: post.title,
  tags: [post.categoryLabel],
  publish: 'published',
  content: post.content,
  coverUrl: post.image,
  metaTitle: post.title,
  totalViews: 120 + index * 37,
  totalShares: 12 + index,
  description: post.excerpt,
  totalComments: 0,
  totalFavorites: 0,
  metaKeywords: [post.categoryLabel],
  metaDescription: post.excerpt,
  comments: [],
  createdAt: new Date(2025, 0, 15 - index).toISOString(),
  favoritePerson: [],
  author: { name: post.author, avatarUrl: '' },
}));

const chatContacts: IChatParticipant[] = _contacts.slice(0, 8).map((contact, index) => ({
  ...contact,
  status: (['online', 'offline', 'busy', 'alway'] as const)[index % 4],
}));

const chatMessages: IChatMessage[] = [
  {
    id: 'demo-message-1',
    body: 'Xin chào, tôi cần tư vấn thêm về sản phẩm.',
    senderId: chatContacts[0].id,
    contentType: 'text',
    createdAt: new Date().toISOString(),
    attachments: [],
  },
];

const conversations: IChatConversation[] = chatContacts.map((contact, index) => ({
  id: `demo-conversation-${index + 1}`,
  type: 'ONE_TO_ONE',
  unreadCount: index % 3,
  messages: chatMessages.map((message) => ({ ...message, senderId: contact.id })),
  participants: [contact],
}));

const mailLabels: IMailLabel[] = [
  { id: 'inbox', type: 'system', name: 'Inbox', color: '#078DEE', unreadCount: 3 },
  { id: 'sent', type: 'system', name: 'Sent', color: '#00A76F' },
  { id: 'drafts', type: 'system', name: 'Drafts', color: '#FFAB00' },
  { id: 'trash', type: 'system', name: 'Trash', color: '#FF5630' },
  { id: 'important', type: 'custom', name: 'Important', color: '#8E33FF' },
];

const mails: IMail[] = _contacts.slice(0, 10).map((contact, index) => ({
  id: `demo-mail-${index + 1}`,
  folder: 'inbox',
  subject: [
    'Thông tin đơn hàng sofa',
    'Cập nhật chính sách đại lý',
    'Lịch hẹn tư vấn sản phẩm',
  ][index % 3],
  message: `Xin chào, đây là thư minh họa số ${index + 1} trong hộp thư demo.`,
  isUnread: index < 3,
  from: { name: contact.name, email: contact.email, avatarUrl: contact.avatarUrl },
  to: [{ name: 'LUXE Sofa', email: 'demo@luxe-sofa.local', avatarUrl: null }],
  labelIds: index % 2 ? ['inbox', 'important'] : ['inbox'],
  isStarred: index === 0,
  isImportant: index === 1,
  createdAt: new Date(Date.now() - index * 86_400_000).toISOString(),
  attachments: [],
}));

const calendarEvents: ICalendarEvent[] = Array.from({ length: 8 }, (_, index) => {
  const start = new Date();
  start.setDate(start.getDate() + index);
  start.setHours(9 + (index % 5), 0, 0, 0);
  const end = new Date(start);
  end.setHours(start.getHours() + 1);
  return {
    id: `demo-event-${index + 1}`,
    color: ['#8A6746', '#078DEE', '#00A76F', '#FFAB00'][index % 4],
    title: `Lịch tư vấn sofa ${index + 1}`,
    allDay: false,
    description: 'Sự kiện lịch minh họa, được lưu trong bộ nhớ của ứng dụng.',
    start: start.toISOString(),
    end: end.toISOString(),
  };
});

const kanbanColumns = [
  { id: 'todo', name: 'Cần làm' },
  { id: 'progress', name: 'Đang thực hiện' },
  { id: 'done', name: 'Hoàn thành' },
];

const kanbanTasks: IKanbanTask[] = [
  {
    id: 'demo-task-1',
    name: 'Chuẩn bị nội dung bộ sưu tập mới',
    status: 'todo',
    priority: 'high',
    labels: ['Nội dung'],
    attachments: [],
    comments: [],
    assignee: [],
    due: [new Date().toISOString(), new Date(Date.now() + 86_400_000).toISOString()],
    reporter: { id: 'demo-user', name: 'LUXE Sofa', avatarUrl: '' },
  },
  {
    id: 'demo-task-2',
    name: 'Cập nhật thông tin sản phẩm',
    status: 'progress',
    priority: 'medium',
    labels: ['Sản phẩm'],
    attachments: [],
    comments: [],
    assignee: [],
    due: [new Date().toISOString(), new Date(Date.now() + 2 * 86_400_000).toISOString()],
    reporter: { id: 'demo-user', name: 'LUXE Sofa', avatarUrl: '' },
  },
];

const kanbanBoard: IKanban = {
  columns: kanbanColumns,
  tasks: {
    todo: [kanbanTasks[0]],
    progress: [kanbanTasks[1]],
    done: [],
  },
};

function getMockResponse(url: string, params: MockRequestConfig['params'] = {}) {
  if (url === endpoints.calendar) return { events: calendarEvents };
  if (url === endpoints.kanban) return { board: kanbanBoard };

  if (url === endpoints.chat) {
    const {endpoint} = params;
    if (endpoint === 'contacts') return { contacts: chatContacts };
    if (endpoint === 'conversation') {
      return {
        conversation: conversations.find((item) => item.id === params.conversationId),
      };
    }
    return { conversations };
  }

  if (url === endpoints.product.list) return { products };
  if (url === endpoints.product.details) {
    return { product: products.find((item) => item.id === String(params.productId)) };
  }
  if (url === endpoints.product.search) {
    const query = String(params.query ?? '').trim().toLowerCase();
    return {
      results: products.filter((item) =>
        `${item.name} ${item.description}`.toLowerCase().includes(query)
      ),
    };
  }

  if (url === endpoints.post.list) return { posts };
  if (url === endpoints.post.details) {
    return { post: posts.find((item) => item.title === String(params.title)) };
  }
  if (url === endpoints.post.latest) {
    return {
      latestPosts: posts
        .filter((item) => item.title !== String(params.title))
        .slice(0, 4),
    };
  }
  if (url === endpoints.post.search) {
    const query = String(params.query ?? '').trim().toLowerCase();
    return {
      results: posts.filter((item) =>
        `${item.title} ${item.description} ${item.content}`.toLowerCase().includes(query)
      ),
    };
  }

  if (url === endpoints.mail.labels) return { labels: mailLabels };
  if (url === endpoints.mail.list) {
    const labelId = String(params.labelId ?? '');
    return { mails: mails.filter((mail) => !labelId || mail.labelIds.includes(labelId)) };
  }
  if (url === endpoints.mail.details) {
    return { mail: mails.find((mail) => mail.id === String(params.mailId)) };
  }

  if (url === '/api/navbar') {
    return {
      navItems: [
        {
          subheader: 'Demo',
          items: [
            { title: 'Tổng quan', path: '/dashboard', icon: 'icon.landing' },
            { title: 'Sofa', path: '/sofa2', icon: 'icon.services' },
            { title: 'Bài viết', path: '/sofa2/blog', icon: 'icon.blog' },
          ],
        },
      ],
    };
  }

  throw new Error(`Chưa có dữ liệu mock cục bộ cho endpoint: ${url}`);
}

export async function fetchMockApi<T>(args: MockFetchArgs): Promise<T> {
  const url = typeof args === 'string' ? args : String(args[0]);
  const config = Array.isArray(args) ? args[1] as MockRequestConfig | undefined : undefined;
  return getMockResponse(url, config?.params) as T;
}

export const fetcher = fetchMockApi;
