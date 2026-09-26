# AI Agent Instructions

## Project structure
- `backend/`: Express + Node.js API server using ES modules.
  - `backend/src/routes/`: route definitions
  - `backend/src/controller/`: request handlers
  - `backend/src/models/`: Mongoose models
  - `backend/src/middleware/`: authentication and request middleware
  - `backend/src/db/`: MongoDB connection logic
  - `backend/src/utils/`: shared helpers, error and response classes
- `frontend/`: React + Vite web app with TailwindCSS.
  - `frontend/src/components/`: reusable UI components
  - `frontend/src/context/`: app-level React context
  - `frontend/src/pages/`: route pages organized by role
  - `frontend/src/main.jsx`: app bootstrap
  - `frontend/src/App.jsx`: client-side routing and layout

## How to run
- Backend: `cd backend && npm install && npm run dev`
- Frontend: `cd frontend && npm install && npm run dev`
- There is no root `package.json`; work inside each folder separately.

## Key conventions
- Backend is an API server with Express and MongoDB/Mongoose.
- Authentication uses JWT tokens for suppliers and users.
- Frontend stores the API base URL in `AppContext` via `import.meta.env.VITE_BACKEND_URL`.
- API calls use `axios` and the backend routes are mounted under `/api/v1/`.
- React uses functional components, hooks, and `react-router-dom` v7.

## Important details
- Frontend auth state is managed in `frontend/src/context/AppContext.jsx`.
- `frontend/src/App.jsx` controls when the navbar/sidebar are shown based on auth routes.
- Backend config is loaded with `dotenv` in `backend/src/index.js`.
- Important backend environment variables:
  - `PORT`
  - `MONGODB_URI`
  - `JWT_SECRET_KEY`

## When assisting on this repo
- Prefer modifying files in the correct package folder, not creating a root monorepo script.
- Preserve existing Express route/controller separation.
- Keep frontend updates aligned with the current React + Vite + Tailwind setup.
- If adding new API endpoints, wire them through `backend/src/routes/*` and the appropriate controller.

## Missing project docs
- There is no root `README.md` or workspace-level docs beyond `frontend/README.md`.
- Use code and package manifests as the primary source of truth.
