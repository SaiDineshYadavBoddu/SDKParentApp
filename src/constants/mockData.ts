export const MOCK_TRANSACTIONS = [
  {
    id: '1',
    title: 'Pizza Hut',
    txnId: '123812384123',
    date: '27 Aug 2025, 08:12 AM',
    amount: '215.89',
    status: 'Approved',
    cardId: 'card_123',
  },
  {
    id: '2',
    title: 'Zara',
    txnId: '123812384123',
    date: '26 Aug 2025, 09:22 PM',
    amount: '215.89',
    status: 'Approved',
    cardId: 'card_123',
  },
  {
    id: '3',
    title: 'Funds Added',
    txnId: '123812384123',
    date: '25 Aug 2025, 03:55 PM',
    amount: '215.89',
    status: 'Funds added',
    cardId: 'card_123',
    isCredit: true,
  },
  {
    id: '4',
    title: 'Domino’s Pizza',
    txnId: '123812384123',
    date: '24 Aug 2025, 11:01 AM',
    amount: '215.89',
    status: 'Approved',
    cardId: 'card_123',
  },
  {
    id: '5',
    title: 'Star Bucks',
    txnId: '123812384123',
    date: '23 Aug 2025, 07:44 PM',
    amount: '215.89',
    status: 'Approved',
    cardId: 'card_123',
  },
  {
    id: '6',
    title: 'Amazon',
    txnId: '123812384124',
    date: '22 Aug 2025, 10:15 AM',
    amount: '550.00',
    status: 'Pending',
    cardId: 'card_456',
  },
];

export const MOCK_CARDS = [
  {
    id: "1",
    cardIdentifier: "card_123",
    maskedPan: "1234 **** **** 1234",
    expiryDate: "12/26",
    cardholderName: "John Doe",
    cvv: "123",
    status: "Active"
  },
  {
    id: "2",
    cardIdentifier: "card_456",
    maskedPan: "5678 **** **** 5678",
    expiryDate: "11/27",
    cardholderName: "John Doe",
    cvv: "456",
    status: "Active"
  }
];
