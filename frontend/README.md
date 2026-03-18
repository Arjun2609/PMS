# Frontend README

## Pet Management System - Frontend

### Overview

React-based user interface for the Pet Management System. Provides dashboard, forms, and management tools for pet owners, veterinarians, and clinic staff.

### Project Structure

- `/src/components` - Reusable React components
- `/src/pages` - Page-level components (Dashboard, Login, etc.)
- `/src/services` - API communication layer
- `/src/utils` - Helper functions and constants
- `/src/styles` - CSS/SCSS styling
- `/public` - Static assets

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Running the Application

**Development**:

```bash
npm start
```

**Build for Production**:

```bash
npm run build
```

**Run Tests**:

```bash
npm test
```

### Key Features

- **User Authentication** - Login/Logout with JWT
- **Dashboard** - Overview of appointments and pets
- **Pet Management** - Add, edit, delete pets
- **Appointment Booking** - Schedule and manage appointments
- **Medical Records** - View pet medical history
- **Prescription Tracking** - View and manage prescriptions
- **Clinic Directory** - Find and view clinics
- **Doctor Profiles** - View veterinarian information

### Main Pages

- `/` - Home/Landing page
- `/login` - User login
- `/dashboard` - Main dashboard
- `/pets` - Pet management
- `/appointments` - Appointment scheduling
- `/medical-records` - Medical history
- `/clinics` - Clinic directory
- `/profile` - User profile

### Components

### Services

API communication layer:

- `apiClient.js` - Axios instance with configuration
- `authService.js` - Authentication operations
- `petService.js` - Pet CRUD operations
- `appointmentService.js` - Appointment operations
- `medicalRecordService.js` - Medical records
- `prescriptionService.js` - Prescription management

### State Management

Using Zustand for state management:

- Auth store - User authentication state
- Pet store - Pet management state
- Appointment store - Appointment state

### Styling

- CSS modules for component-scoped styles
- Global styles in App.css
- Responsive design with mobile-first approach

### Dependencies

- `react` - UI library
- `react-dom` - React rendering
- `axios` - HTTP client
- `react-router-dom` - Routing
- `zustand` - State management

### DevDependencies

- `react-scripts` - CRA build scripts
- `@types/react` - TypeScript types

### Build & Deployment

```bash
# Production build
npm run build

# Start production server
serve -s build
```

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- CSS minification
- Bundle size monitoring

### Contributing

1. Create a feature branch
2. Follow component structure
3. Test responsiveness
4. Submit pull request
