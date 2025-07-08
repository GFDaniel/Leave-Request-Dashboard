# Leave Request Dashboard

Leave Request Management System built with Next.js, React, and SAP UI5 Web Components.

## 🚀 What Was Implemented

### Core Features

- **📋 Leave Request Management**: View, create, edit, approve, and reject employee leave requests
- **🔍 Advanced Filtering**: Filter requests by status (Pending, Approved, Rejected) with tab-based navigation
- **📊 Summary Dashboard**: Real-time statistics cards showing total, pending, approved, and rejected requests
- **🌐 Internationalization**: Full i18n support with English and Spanish translations

### Technical Implementation

- **🎨 Modern UI**: SAP UI5 Web Components for enterprise-grade user experience
- **📡 API Integration**: RESTful API integration with MockAPI for data persistence
- **🎯 TypeScript**: Full type safety throughout the application

### Key Components

- **Dashboard**: Main interface with summary cards and filterable table
- **Create Modal**: Form for submitting new leave requests with validation
- **Details Modal**: View and edit existing requests with approval/rejection actions
- **Filter Controls**: Tab-based status filtering with sorting capabilities
- **Language Selector**: Dynamic language switching between English and Spanish

## 🏃‍♂️ How to Run the Project

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/GFDaniel/Leave-Request-Dashboard.git
   cd Leave-Request-Dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

## 🧪 How to Run the Tests

### Test Commands

\`\`\`bash

# Run all tests once

npm test

# Run tests in watch mode (recommended for development)

npm run test:watch

# Run tests with interactive UI

npm run test:ui

# Run tests with coverage report

npm run test:coverage
\`\`\`

### Test Coverage

The project includes comprehensive tests covering:

- ✅ **Service Layer**: API integration and data transformation
- ✅ **Components**: User interactions and rendering
- ✅ **Hooks**: Business logic and state management
- ✅ **Utilities**: Helper functions and data processing

# Terminal 1: Development server

npm run dev

# Terminal 2: Tests in watch mode

npm run test:watch
\`\`\`

## 🎨 SAP UI5 Components Used

### Core UI Components

- **\`Button\`** - Primary actions (Create, Approve, Reject, Save, Cancel)
- **\`Input\`** - Text input fields for employee names and reasons
- **\`Title\`** - Page and section headings
- **\`MessageStrip\`** - Error messages and notifications

### Form & Navigation

- **Native HTML Elements** - Date inputs, select dropdowns, and textareas
- **Custom Tab Navigation** - Status filtering with active state indicators
- **Modal Dialogs** - Create and edit request forms with backdrop

### Data Display

- **HTML Table** - Main data grid with responsive design
- **Status Badges** - Color-coded status indicators
- **Summary Cards** - Dashboard statistics with trend indicators
- **Avatar Circles** - Employee initials display
