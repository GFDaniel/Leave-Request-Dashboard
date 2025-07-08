# Leave Request Dashboard

## Tech Stack

- **Framework**: Next.js 14 (latest stable)
- **UI Library**: SAP UI5 Web Components for React (@ui5/webcomponents-react)
- **Testing**: Vitest + React Testing Library
- **Language**: TypeScript

## Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd leave-request-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Running Tests

### Run all tests

\`\`\`bash
npm test
\`\`\`

### Run tests with UI

\`\`\`bash
npm run test:ui
\`\`\`

### Run tests with coverage

\`\`\`bash
npm run test:coverage
\`\`\`

### Test Coverage

The test suite covers:

- ✅ Filtering logic (LeaveRequestUtils)
- ✅ Approval/rejection behavior (useLeaveRequests hook)
- ✅ Component interactions (ActionButtons)
- ✅ UI state management
- ✅ Service layer functionality

## API Integration

The application integrates with the mock API endpoint:

- **Base URL**: `https://67f551e6913986b16fa426fd.mockapi.io/api/v1/`
- **Endpoint**: `/leave-requests`
- **Fallback**: Local mock data if API is unavailable

## Key Features Implementation

### Filtering by Status

- Uses SAP UI5 Select component
- Real-time filtering without API calls
- Maintains filter state across interactions

### Sorting by Date

- Toggle between ascending/descending order
- Visual indicators for current sort direction
- Sorts by date requested field

### Approve/Reject Actions

- Only available for pending requests
- Optimistic UI updates
- Error handling with user feedback

### Responsive Design

- Mobile-friendly table layout
- Flexible filter controls
- Accessible UI components

## Development Notes

- The application uses mock data as fallback when the API is unavailable
- All components are fully typed with TypeScript
- Error boundaries handle API failures gracefully
- The service layer abstracts data operations for easy testing

## Future Enhancements

- Add pagination for large datasets
- Implement real-time updates with WebSocket
- Add bulk actions for multiple requests
- Include date range filtering
- Add export functionality
