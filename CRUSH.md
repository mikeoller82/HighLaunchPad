# HighLaunchPad CRUSH file

This file provides context to AI agents about the HighLaunchPad codebase.

## Commands

- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Run tests:** This project uses Cypress for testing. Run tests with `npm run cypress:open`. There is no single command to run a single test.
- **Run dev server:** `npm run dev`

## Code Style

- **Formatting:** This project uses Prettier for code formatting. No special configuration is present, so default settings are assumed.
- **Imports:** Use absolute imports from the `@` alias where possible (e.g., `import { Button } from '@/components/ui/button'`).
- **Types:** This is a TypeScript project. Use types wherever possible. Type definitions are located in the `types/` directory.
- **Naming Conventions:**
    - Components: PascalCase (e.g., `MyComponent`)
    - Functions: camelCase (e.g., `myFunction`)
    - Interfaces/Types: PascalCase (e.g., `MyType`)
- **Error Handling:** Use `try...catch` blocks for asynchronous operations. Use the `useToast` hook to display error messages to the user.

## Project Structure

- **Components:** Reusable React components are located in `src/components/`.
- **API Routes:** API routes are located in `src/app/api/`.
- **Library Functions:** Core business logic and utility functions are located in `src/lib/`.
- **Static Assets:** Static assets are located in the `public/` directory.
