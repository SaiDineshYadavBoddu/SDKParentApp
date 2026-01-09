export type RequestAction = {
  id: number;
  actionType: string;
  subject: string;
  subjectId: string;
  displayName: string;
  details: string;
  payload?: {
    params: Record<string, any>;
    actionBody: string;
  };
  resultPayload?: {
    params: Record<string, any>;
    errorMessage?: string;
  };
  status?: string;
  lastModifiedAt?: string;
};

export type RequestItem = {
  id: number;
  actions: RequestAction[];
  requester: string;
  status: string;
  createdAt: string;
  lastModifiedAt: string;
  requesterId: string;
  approver?: string;
  approverId?: string;
  approval?: {
    approver?: string;
    approverId?: string;
    approvedAt?: string;
  };
  rejectReason?: string;
};
