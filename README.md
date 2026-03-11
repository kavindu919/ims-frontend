# Inventory Management System - Frontend

This is the frontend application for the Inventory Management System (IMS), built with Next.js 15, React 19, and Tailwind CSS 4. It provides a comprehensive interface for managing inventory, storage locations, borrow records, and system users.

## Key Features

- **Interactive Dashboard**: Real-time analytics and distribution charts using Recharts.
- **Inventory Management**: Full CRUD operations for tracking inventory items, including status monitoring (In Store, Borrowed, Damaged, Missing).
- **Storage Organization**: Hierarchical management of storage places and specific cupboards.
- **Borrowing Records**: Automated tracking of borrowed items with overdue status indicators.
- **User Management**: Administrative control over system users and access levels.
- **Activity Logs**: Comprehensive audit trail for all system actions.
- **Responsive Interface**: Modern, premium UI designed for efficiency and clarity.

## Technical Stack

- **Framework**: Next.js 15.1.6 (App Router)
- **Library**: React 19.0.0
- **Styling**: Tailwind CSS 4.0.0
- **State Management**: React Context API
- **Data Fetching**: Axios
- **Data Visualization**: Recharts
- **Icons**: React Icons (Feather Icons/Lucide)
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 20.x or higher
- npm or yarn

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ims-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Runs the app in development mode with hot-reloading.
- `npm run build`: Builds the application for production optimization.
- `npm run start`: Starts the production server after building.
- `npm run lint`: Runs ESLint to check for code quality and patterns.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `context/`: React Context providers for global state.
- `services/`: API integration layer using Axios.
- `hook/`: Custom React hooks for business logic.
- `utils/`: Helper functions, interfaces, and constants.
- `public/`: Static assets and icons.

## API Integration

The frontend communicates with a backend service specified in the `NEXT_PUBLIC_API_URL` environment variable. Ensure the backend is running and accessible before performing authenticated operations.

## License

This project is licensed under the MIT License.
