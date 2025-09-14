# ContractsPro - SaaS Contracts Management Dashboard

A modern, responsive React application for managing and analyzing contract portfolios with AI-powered insights.

## 🚀 Live Demo

[View Live Demo](https://your-deployment-url.vercel.app)

## 📋 Features

- **Authentication System**: Secure login with JWT token management
- **Dashboard Overview**: Comprehensive contract portfolio insights
- **Contract Management**: Search, filter, and paginate through contracts
- **Detailed Contract View**: In-depth contract analysis with clauses and insights
- **File Upload**: Drag & drop contract upload with progress tracking
- **Responsive Design**: Optimized for desktop and mobile devices
- **Mock API Integration**: Realistic data fetching with loading states

## 🛠 Tech Stack

- **Frontend**: React 18, Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: React Context API
- **TypeScript**: Full type safety
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── contracts-table.tsx
│   ├── contract-details.tsx
│   ├── dashboard-layout.tsx
│   └── upload-modal.tsx
├── context/             # React Context providers
│   ├── auth-context.tsx
│   ├── contracts-context.tsx
│   └── app-context.tsx
├── hooks/               # Custom React hooks
│   └── use-contracts.ts
├── services/            # API services
│   └── api.ts
├── public/              # Static assets and mock data
│   ├── contracts.json
│   └── contracts/
└── lib/                 # Utility functions
    └── utils.ts
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd contracts-dashboard
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Access

For demo purposes, you can:
- **Login**: Use any username with password `test123`
- **Demo Mode**: Click "Continue as Demo User" to skip authentication

## 🎯 Key Features Implemented

### Authentication
- JWT-based authentication with localStorage persistence
- Protected routes with automatic redirects
- Demo mode for easy access

### Dashboard
- Responsive sidebar navigation
- User profile dropdown with logout
- Contract statistics and insights

### Contract Management
- Paginated table (10 items per page)
- Real-time search functionality
- Status and risk level filtering
- Detailed contract views with metadata

### File Upload
- Drag & drop interface
- Progress tracking with status indicators
- Simulated upload process with success/error handling

### State Management
- Context API for global state
- Separate contexts for auth, contracts, and app state
- Proper error handling and loading states

## 🔧 Technical Decisions & Assumptions

### Architecture Choices
- **Next.js App Router**: Modern routing with server components
- **Context API**: Lightweight state management suitable for app size
- **Mock API**: JSON files simulate real backend with network delays
- **Component Structure**: Modular, reusable components following React best practices

### Assumptions Made
- **Authentication**: Simple JWT simulation (production would use proper auth service)
- **Data Persistence**: Mock data resets on refresh (production would use real database)
- **File Upload**: Simulated process (production would integrate with cloud storage)
- **AI Insights**: Static mock data (production would integrate with AI services)

### Design Decisions
- **Mobile-First**: Responsive design prioritizing mobile experience
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Comprehensive loading, error, and empty states
- **Color Scheme**: Professional dark/light theme support

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation with expanded content
- **Tablet**: Collapsible sidebar with optimized layouts
- **Mobile**: Bottom navigation with touch-friendly interactions

## 🧪 Error Handling

- Network error recovery with retry mechanisms
- Graceful fallbacks for missing data
- User-friendly error messages
- Loading states for all async operations

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Deploy with default settings
3. The app will be available at your Vercel URL

## 📄 License

This project is created for demonstration purposes.
