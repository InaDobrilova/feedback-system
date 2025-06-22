# Feedback Management System

This is a React TypeScript application with Node.js backend for managing user feedback, bug reports, and feature requests.

## 🚀 Features

- **React 19** with TypeScript for type-safe development
- **Vite** for fast development and building
- **Axios** for HTTP requests with interceptors
- **Complete Feedback Management** with CRUD operations
- **Filtering & Search** by category, status, and text
- **Pagination** for large datasets
- **Responsive UI**
- **Custom hooks** for data fetching and mutations
- **Comprehensive validation** on both frontend and backend
- **RESTful API** with Express.js backend
- **Environment variables** support for different environments
- **Error handling** and loading states
- **ESLint** configuration for code quality

## 🗂️ Feedback System Structure

```js

src/
├── api/                 # API related code
│   ├── client.ts       # Axios client configuration
│   ├── endpoints.ts    # API endpoints definition
│   └── index.ts        # API functions (auth, users, feedback)
├── components/         # Reusable React components
│   ├── FeedbackList.tsx
│   ├── FeedbackGrid.tsx
│   ├── FeedbackForm.tsx
│   ├── EditFeedbackDialog.tsx
│   ├── DeleteConfirmationDialog.tsx
│   └── index.ts        # Component exports
├── hooks/              # Custom React hooks
│   ├── useApi.ts       # React hooks for API calls
│   └── useDebounce.ts  # Debounce hook for search/filter
├── types/              # TypeScript type definitions
│   └── api.ts          # API request/response types
├── utils/              # Utility functions
│   ├── helpers.ts      # Common helper functions
│   └── constants.ts    # App-wide constants
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🛠️ Installation

1. Install dependencies:

The easiest way to install all dependencies and start both projects is to use the following script from the root folder.

```bash
npm run start:all
```

Otherwise in both backend and frontend source directories you will need to run:
```bash
npm install
```

## 🏃‍♂️ Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Building

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 🔧 API Integration

### Configuration

The API client is configured in `src/api/client.ts` with:

- Base URL from environment variables

### API Functions

All API calls are organized in `src/api/index.ts`:

- `feedbackAPI` - CRUD operations for feedback

## 🌍 Environment Variables

Available environment variables:

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## 📚 Backend Requirements

This frontend expects a REST API with the following endpoints:

### Feedback

- `GET /feedback` - Get all feedback
- `POST /feedback` - Create new feedback
- `GET /feedback/:id` - Get feedback by ID
- `PUT /feedback/:id` - Update feedback
- `DELETE /feedback/:id` - Delete feedback

## 📝 Adding New Features

1. **Add new API endpoints** in `src/api/endpoints.ts`
2. **Create API functions** in `src/api/index.ts`
3. **Add TypeScript types** in `src/types/api.ts`
4. **Build components** using the hooks for data fetching

### Feedback Model

Each feedback item contains:

- **Name**: User's full name (required)
- **Email**: User's email address (required)
- **Content**: Detailed feedback description (required)
- **Category**: Type of feedback
  - `Bug`: Report software issues
  - `Feature`: Request new features  
  - `Request`: General requests or questions
- **Status**: Current feedback status
  - `Pending`: Newly submitted, awaiting review
  - `Resolved`: Issue has been addressed
  - `Closed`: Feedback is closed/archived

### Future Improvements

- **Support for user management**
- **Authentication and authorization**
- **Tests**: Including Unit Tests and E2E Testing

### Prompts used during development

- Project setup - `Please help me setup a project using react, vite and Material UI`
- Generation of documentation - `Please generate documentation for the project, based on the folder structure, features, dependencies, models and how to install and use the system.`
- Commenting code - `Please add comments throught the project, so it serves the next developer best.`
- Fixing typescript errors - `Please fix the following typescript errors (provided list of errors)`
- Resolving build errors - `I am getting this build error "Too many open files Error: EMFILE: too many open files" how do I fix it?`
