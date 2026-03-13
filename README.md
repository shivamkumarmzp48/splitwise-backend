# Splitwise MVP Backend

A RESTful API backend for a simplified Splitwise application, built with Node.js, Express, and SQLite.  
This project implements core features for managing users, expenses, and balances between friends.

> **Postman Collection** – The complete API test collection is included in the repository as [`Splitwise API.postman_collection.json`](./Splitwise%20API.postman_collection.json). Import it into Postman to quickly test all endpoints.

## Tech Stack

- **Node.js** – JavaScript runtime
- **Express** – Web framework
- **Sequelize** – ORM for SQLite
- **SQLite** – Lightweight relational database
- **Postman** – API testing and documentation

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/splitwise-backend.git
   cd splitwise-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

4. **Optional – run with auto‑restart (development)**
   ```bash
   npm run dev
   ```

## Authentication

For simplicity, authentication is simulated using a custom header `X-User-Id`.  
Include the ID of the logged‑in user in all requests that require user context (e.g., creating expenses, viewing balances).

Example header:  
`X-User-Id: 1`

## API Endpoints

### Users

| Method | Endpoint          | Description                     | Request Body (JSON)                               | Response                                   |
|--------|-------------------|---------------------------------|---------------------------------------------------|--------------------------------------------|
| POST   | `/users`          | Create a new user               | `{ "email": "...", "password": "...", "currency": "USD" }` | Created user object with `id`             |
| GET    | `/users/:id`      | Get user profile                | –                                                 | User object                                |
| PUT    | `/users/:id`      | Update email/currency           | `{ "email": "...", "currency": "..." }` (optional) | Updated user object                        |
| DELETE | `/users/:id`      | Delete user account             | –                                                 | `204 No Content`                           |

### Expenses

All expense endpoints require the `X-User-Id` header.

| Method | Endpoint               | Description                     | Request Body (JSON)                                                                 | Response                                   |
|--------|------------------------|---------------------------------|-------------------------------------------------------------------------------------|--------------------------------------------|
| POST   | `/expenses`            | Create a new expense            | `{ "name": "Dinner", "value": 100, "currency": "USD", "date": "2026-03-13", "paidById": 1, "memberIds": [1,2] }` | Created expense object with participants   |
| GET    | `/expenses/:id`        | Get expense details             | –                                                                                   | Expense object with `Creator`, `Payer`, `Participants` |
| PUT    | `/expenses/:id`        | Update an expense               | Any updatable field(s) – e.g., `{ "name": "Lunch" }`                               | Updated expense object                     |
| DELETE | `/expenses/:id`        | Delete an expense               | –                                                                                   | `204 No Content`                           |
| GET    | `/expenses/activity`   | Get activity log for the user   | Optional query params: `?from=YYYY-MM-DD&to=YYYY-MM-DD`                             | Array of expenses the user is part of      |

### Balances

All balance endpoints require the `X-User-Id` header.

| Method | Endpoint       | Description                     | Response                                                                                          |
|--------|----------------|---------------------------------|---------------------------------------------------------------------------------------------------|
| GET    | `/balances`    | Get net balances with all users | `[ { "user": { "id": 2, "email": "bob@example.com" }, "balance": 30.00 }, ... ]`                 |

> **Note:** A positive balance means the other user owes money to the logged‑in user; a negative balance means the logged‑in user owes money to the other user.

## Folder Structure

```
splitwise-backend/
├── config/
│   └── config.json          # Database configuration
├── src/
│   ├── models/               # Sequelize models (User, Expense, ExpenseParticipant)
│   ├── controllers/          # Business logic for each resource
│   ├── routes/               # Express route definitions
│   ├── middlewares/          # Custom middleware (auth simulation)
│   ├── app.js                # Express app setup
│   └── server.js             # Entry point
├── .gitignore
├── package.json
├── README.md
└── Splitwise API.postman_collection.json   # Postman collection for testing
```

## Example Workflow

1. **Create two users** (Alice and Bob) – note their IDs.
2. **Alice adds an expense** of $100 for both (she pays).
3. **Bob adds an expense** of $40 for both (he pays).
4. **Check balances** – Bob owes Alice $30.
5. **View activity log** – both expenses appear for each user.
6. **Update or delete** any expense as needed.

## Future Improvements

- Proper authentication (JWT, OAuth)
- Email reports for monthly balances
- Expense categories and split customisation (percentages, unequal shares)
- Group expenses and group balances
- Input validation and error handling
- Pagination for activity log

