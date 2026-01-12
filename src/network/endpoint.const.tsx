export const API_ENDPOINTS = {
  GET_CARDS: '/cards/mine',
  GET_TRANSACTIONS: '/cards/mine/transactions',
  GET_CARD_LIMITS: '/cards/mine/{cardId}/limits',
  GET_CARD_RESTRICTIONS: '/cards/mine/{cardId}/restrictions',
  POST_CLOSE_CARD: '/cards/mine/{cardId}/close',
  GET_CARD_TARIFFS: '/cards/{cardId}/tariffs',
} as const;
