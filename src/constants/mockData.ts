export const MOCK_TRANSACTIONS = [
  {
    transactionRefId: '100000000123',
    merchantName: 'Pizza Hut',
    amount: 120.00,
    currency: 'AED',
    maskedPan: '223444******4734',
    transactionDate: new Date().toISOString(), // Today
    transactionType: 'POSTED',
    cardId: '22344402192265617774',
  },
  {
    transactionRefId: '100000000124',
    merchantName: 'Carrefour Market',
    amount: 250.50,
    currency: 'AED',
    maskedPan: '223444******4734',
    transactionDate: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      d.setDate(15); // Middle of last month
      return d.toISOString();
    })(),
    transactionType: 'POSTED',
    cardId: '22344402192265617774',
  },
  {
    transactionRefId: '100000000125',
    merchantName: 'ZARA Dubai Mall',
    amount: 850.00,
    currency: 'AED',
    maskedPan: '223444******4734',
    transactionDate: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 2);
      d.setDate(10);
      return d.toISOString();
    })(),
    transactionType: 'POSTED',
    cardId: '22344402192265617774',
  },
  {
    transactionRefId: '100000000126',
    merchantName: 'Etisalat Payment',
    amount: 300.00,
    currency: 'AED',
    maskedPan: '223444******4734',
    transactionDate: (() => {
      const d = new Date();
      d.setMonth(1); // February
      d.setDate(5);
      return d.toISOString();
    })(),
    transactionType: 'POSTED',
    cardId: '22344402192265617774',
  },
  {
    transactionRefId: '100000000127',
    merchantName: 'Amazon.ae',
    amount: 55.00,
    currency: 'AED',
    maskedPan: '223444******0517',
    transactionDate: new Date().toISOString(),
    transactionType: 'PENDING',
    cardId: '22344402137211902994',
  },
];

export const MOCK_CARDS = [
  {
    product: "commercial",
    cardholderName: "ARIS ABDUL AZEEZ",
    cardStatus: "Active",
    status: "Ready",
    expiryDate: "2032-04-30",
    currencyCode: "AED",
    balance: 50250.77,
    maskedPan: "223444******4734",
    cardIdentifier: "22344402192265617774",
    brand: "MC",
  },
  {
    product: "commercial",
    cardholderName: "ARIS ABDUL AZEEZ",
    cardStatus: "PENDING_ACTIVATION",
    status: "Ready",
    expiryDate: "2031-03-31",
    currencyCode: "AED",
    balance: 0.0,
    maskedPan: "223444******2712",
    cardIdentifier: "22344402159687713358",
    brand: "MC",
  },
  {
    product: "commercial",
    cardholderName: "ARIS ABDUL AZEEZ",
    cardStatus: "Blocked",
    statusCause: "TempBlocked",
    status: "Error",
    expiryDate: "2031-03-31",
    currencyCode: "AED",
    balance: 0.0,
    maskedPan: "223444******0517",
    cardIdentifier: "22344402137211902994",
    brand: "MC",
  },
];
