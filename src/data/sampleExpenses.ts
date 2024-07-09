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
  
export const  sampleGroupData = [
  {
    id: "1",
    name: "Developers Group",
    description: "A group for all the developers in the organization",
    createdBy: "john_doe",
    admin: "jane_smith",
    members: ["john_doe", "jane_smith", "bob_brown"],
    createdAt: "2024-01-01T12:00:00Z",
    updatedAt: "2024-01-10T12:00:00Z"
  },
  {
    id: "2",
    name: "Marketing Team",
    description: "Marketing professionals sharing ideas and strategies",
    createdBy: "alice_jones",
    admin: "michael_clark",
    members: ["alice_jones", "michael_clark", "lucy_liu"],
    createdAt: "2024-02-01T15:00:00Z",
    updatedAt: "2024-02-15T16:00:00Z"
  },
  {
    id: "3",
    name: "Project Management",
    description: "Discuss project timelines and deliverables",
    createdBy: "karen_white",
    admin: "paul_green",
    members: ["karen_white", "paul_green", "david_black"],
    createdAt: "2024-03-01T09:00:00Z",
    updatedAt: "2024-03-05T09:00:00Z"
  },
  {
    id: "4",
    name: "Design Team",
    description: "Creative discussions and design critiques",
    createdBy: "lisa_blue",
    admin: "emma_gray",
    members: ["lisa_blue", "emma_gray", "henry_yellow"],
    createdAt: "2024-04-01T14:00:00Z",
    updatedAt: "2024-04-20T14:00:00Z"
  },
  {
    id: "5",
    name: "HR Department",
    description: "Human Resources and company policies",
    createdBy: "nancy_red",
    admin: "oscar_purple",
    members: ["nancy_red", "oscar_purple", "george_orange"],
    createdAt: "2024-05-01T11:00:00Z",
    updatedAt: "2024-05-15T11:00:00Z"
  }
]