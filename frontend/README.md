# Inspection Management System Frontend

This is the frontend application for the Inspection Management System, built with React, Tailwind CSS, and Tremor for data visualization.

## Features

- User authentication and authorization
- Dashboard with real-time inspection statistics
- User profile management
- Admin user management
- Inspection details and validation
- Validation queue for chiefs and admins
- Modern, responsive UI with beautiful charts and visualizations

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your environment variables:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API services
  ├── App.jsx        # Main application component
  ├── index.jsx      # Application entry point
  └── index.css      # Global styles and Tailwind imports
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Technologies Used

- React.js - Frontend framework
- React Router - Navigation
- Tailwind CSS - Styling
- Tremor - Data visualization and UI components
- Axios - API requests

## API Integration

The frontend expects the following API endpoints to be available:

- `/api/auth/login` - User authentication
- `/api/user/profile` - User profile management
- `/api/admin/users` - User management (admin only)
- `/api/inspections` - Inspection management
- `/api/dashboard/stats` - Dashboard statistics
- `/api/dashboard/trends` - Dashboard trends

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 