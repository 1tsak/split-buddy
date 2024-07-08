# Split Buddy

## Project Overview

Split Buddy is a web application that allows users to create groups, add expenses, and split bills among group members. The app is built using Firebase for the backend and React for the frontend.

## Key Features

1. **User Authentication**: Users can sign up and log in to the application using their email and password. Registered users can create and manage their own groups.

2. **Group Management**: Authenticated users can create new groups and invite other users to join. Group members can add expenses to the group, specifying the amount, category, and who should pay. Expenses are automatically split among group members based on their share.

3. **Expense Tracking and Reporting**: All expenses are stored in Firebase Firestore, allowing for real-time updates and synchronization across clients. Users can view detailed reports of shared expenses, including the total amount, individual contributions, and balances.

4. **Real-Time Updates and Notifications**: When a new expense is added or a balance is settled, all group members receive real-time updates and notifications. Users can stay informed about the group's financial activities and easily manage their shared expenses.

5. **Responsive and Intuitive UI**: The application features a responsive and visually appealing user interface built with React. Users can easily navigate through the app and perform various expense sharing tasks on both desktop and mobile devices.

6. **Landing page**: Creating a standard landing page is **optional** 

## Technology Stack

- **Backend**: Firebase (Authentication, Firestore)
- **Frontend**: React, typescript, Redux, React Router, Axios, Recharts
- **Deployment**: Firebase Hosting

## Project Structure

The project follows a monorepo structure with separate directories for the backend (Firebase) and frontend (React) applications:

```
Basic folder structure
----------------------
split-buddy/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── store/
    │   ├── utils/
    │   └── App.tsx
    ├── public/
    ├── package.json
    └── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Firebase account and project

## Detailed Feature Description

### User Authentication

- Users can sign up with their email and password.
- Registered users can log in to the application.
- Users can log out of the application.

### Group Management

- Authenticated users can create new groups.
- Users can invite other members to join their groups.
- Group members can add expenses to the group.
- Expenses are automatically split among group members based on their share.
- Users can view their current balance within the group.
- Users can settle up with other group members.

### Expense Tracking and Reporting

- All expenses are stored in Firebase Firestore.
- Users can view detailed reports of shared expenses, including the total amount, individual contributions, and balances.
- The admin dashboard provides group-level expense tracking and management capabilities.

### Real-Time Updates and Notifications

- When a new expense is added or a balance is settled, all group members receive real-time updates and notifications.
- Users can stay informed about the group's financial activities and easily manage their shared expenses.

### Responsive and Intuitive UI

- The application features a responsive and visually appealing user interface built with React.
- Users can easily navigate through the app and perform various expense sharing tasks on both desktop and mobile devices.

## Evaluation Criteria

The Split Buddy project can be used to assess the following skills:

1. **Backend (Firebase)**:
   - Effective usage of Firebase Authentication and Firestore
   - Implementation of user authentication and group management
   - Real-time data management and synchronization using Firestore

2. **Frontend (React)**:
   - Effective usage of React components and state management
   - Integration with the Firebase SDK
   - Proper usage of React Router for navigation
   - Responsive and intuitive user interface design
   - Effective data visualization using charts and graphs

3. **Overall Application**:
   - Adherence to project requirements and feature implementation
   - Code quality, readability, and maintainability
   - Deployment of the full-stack application using Firebase Hosting

## UI/UX
- [Signup](https://dribbble.com/shots/6579270-Sign-up-Form-Splito)
- [login](https://dribbble.com/shots/12096139-Splito-Landing-Page)
- [overall ui](https://dribbble.com/shots/6707811-Expenses-Dashboard-Splito)

The above ui is for reference purpose only and break the overall ui into respective pages and components like
1. UI for groups page.
2. UI for maintaining each group.
3. UI for user profile.
3. UI for activity i.e notifications.
4. UI for each group expense and balance dashboard. 
etc

# project submission date: 12 July 2024
