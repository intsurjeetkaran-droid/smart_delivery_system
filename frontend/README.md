# Smart Delivery Frontend

A modern React frontend for the Smart Delivery and Route Optimization System.

## Features

- User authentication (Customer, Driver, Admin roles)
- Order management
- Real-time delivery tracking
- Interactive maps
- Responsive design with Tailwind CSS
- TypeScript support

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Leaflet** - Interactive maps
- **Socket.io** - Real-time communication
- **Headless UI** - Accessible UI components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── Sidebar.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── OrdersPage.tsx
│   └── TrackingPage.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useOrders.ts
│   └── useTracking.ts
├── services/           # API service functions
│   ├── authService.ts
│   ├── orderService.ts
│   ├── trackingService.ts
│   └── notificationService.ts
├── utils/              # Utility functions and constants
│   ├── api.ts
│   ├── constants.ts
│   └── helpers.ts
├── assets/             # Static assets
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## API Integration

The frontend communicates with the backend API through the following services:

- **Auth Service**: User authentication and profile management
- **Order Service**: Order creation, updates, and management
- **Tracking Service**: Real-time delivery tracking and location updates
- **Notification Service**: Push notifications and alerts

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Contributing

1. Follow the existing code style and structure
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test your changes thoroughly

## License

This project is licensed under the MIT License.