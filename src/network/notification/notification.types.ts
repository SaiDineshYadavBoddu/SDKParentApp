export interface NotificationItem {
  id: number;
  title: string;
  type: string;
  typeDisplayName: string;
  notificationType: string;
  subject: string;
  subjectId: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationResponse {
  content: NotificationItem[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface NotificationRequestParams {
  unreadOnly?: boolean;
  pageSize?: number;
  pageNumber?: number;
}
