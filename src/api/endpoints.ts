export const API_ENDPOINTS = {
  feedback: {
    list: '/feedback',
    create: '/feedback',
    getById: (id: string) => `/feedback/${id}`,
    update: (id: string) => `/feedback/${id}`,
    delete: (id: string) => `/feedback/${id}`,
  },
} as const;
