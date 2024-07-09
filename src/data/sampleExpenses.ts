// sampleData.ts
export const sampleExpenses = [
    {
      id: 'expense1',
      title: 'Rent Payment',
      amount: 1000,
      category: 'Housing',
      createdBy: 'userId1',
      createdAt: '2023-06-01T12:00:00Z',
      updatedAt: '2023-06-01T12:00:00Z',
      splits: [
        { userId: 'userId1', amount: 500, paid: true },
        { userId: 'userId2', amount: 250, paid: false },
        { userId: 'userId3', amount: 250, paid: false },
      ],
    },
    {
      id: 'expense2',
      title: 'Grocery',
      amount: 200,
      category: 'Food',
      createdBy: 'userId2',
      createdAt: '2023-06-05T12:00:00Z',
      updatedAt: '2023-06-05T12:00:00Z',
      splits: [
        { userId: 'userId1', amount: 100, paid: true },
        { userId: 'userId2', amount: 50, paid: true },
        { userId: 'userId3', amount: 50, paid: false },
      ],
    },
  ];
  