# Backend README

## Pet Management System - Backend API

### Overview

RESTful API built with Node.js and Express for managing veterinary clinic operations including doctors, pets, appointments, medical records, and prescriptions.

### Project Structure

- `/src/controllers` - Request handlers for different resources
- `/src/models` - Database models and queries
- `/src/routes` - API route definitions
- `/src/services` - Business logic layer
- `/src/middleware` - Express middleware (auth, error handling)
- `/src/config` - Database and app configuration
- `/src/utils` - Helper functions and utilities
- `/tests` - Unit and integration tests

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pms_db
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
```

### Running the Server

**Development** (with hot reload):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

### API Endpoints

#### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Pets

- `GET /api/pets` - Get all pets
- `POST /api/pets` - Create new pet
- `GET /api/pets/:id` - Get pet details
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

#### Appointments

- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

#### Medical Records

- `GET /api/medical-records` - Get all records
- `POST /api/medical-records` - Create record
- `GET /api/medical-records/:id` - Get record details
- `PUT /api/medical-records/:id` - Update record

#### Prescriptions

- `GET /api/prescriptions` - Get all prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/:id` - Get prescription details
- `PUT /api/prescriptions/:id` - Update prescription

### Testing

```bash
npm test
npm run test:watch
```

### Dependencies

- `express` - Web framework
- `pg` - PostgreSQL client
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `joi` - Data validation

### Error Handling

All endpoints return structured JSON responses:

**Success** (200):

```json
{
  "success": true,
  "data": {}
}
```

**Error** (4xx/5xx):

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### Security

- JWT-based authentication
- Bcrypt password hashing
- CORS enabled
- Helmet security headers
- Input validation with Joi
- SQL injection prevention via parameterized queries

### Development Notes

- All timestamps in UTC
- UUIDs for primary keys
- Comprehensive error handling
- Structured logging ready
- Database connection pooling

### Contributing

1. Create a new branch
2. Make your changes
3. Write/update tests
4. Submit a pull request
