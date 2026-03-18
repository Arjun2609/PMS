# Pet Management System Backend

Clean backend starter using Node.js, Express, PostgreSQL, and `pg`.

## Structure

```text
.
|-- src
|   |-- config
|   |   `-- db.js
|   |-- controllers
|   |   `-- petController.js
|   |-- middleware
|   |   `-- errorHandler.js
|   |-- models
|   |   `-- petModel.js
|   |-- routes
|   |   `-- petRoutes.js
|   |-- services
|   |   `-- petService.js
|   `-- app.js
|-- .env.example
|-- .gitignore
|-- package.json
`-- server.js
```

## Setup

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env`
3. Update PostgreSQL credentials
4. Run with `npm run dev` or `npm start`
