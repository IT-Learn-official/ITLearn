# Contributing to ITLearn

Thank you for considering contributing to ITLearn! We appreciate your time and effort in helping us build a better learning platform. This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. By participating in this project, you agree to:

- Be respectful and constructive in all interactions
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.9.0
- **Bun** (package manager) - [Install Bun](https://bun.sh)
- **PostgreSQL** database
- **Git** for version control

### Initial Setup

1. **Fork and Clone the Repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/www.itlearn.be.git
   cd www.itlearn.be
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Environment Configuration**

   Copy the example environment file and configure your local settings:

   ```bash
   cp .env.example .env
   ```

   Fill in the required environment variables:

   - `DATABASE_URL` - PostgreSQL connection string
   - `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `RESEND_API_KEY` - For email functionality (get from [Resend](https://resend.com))
   - OAuth credentials (optional, for social login)

4. **Database Setup**

   ```bash
   # Generate database migrations
   bun run db:generate

   # Apply migrations
   bun run db:migrate

   # Optional: Open Prisma Studio to view your database
   bun run db:studio
   ```

5. **Start Development Server**

   ```bash
   bun run dev
   ```

   The application will be available at `http://localhost:3000`

---

## Development Workflow

### Branch Naming Convention

Use descriptive branch names following this pattern:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Adding or updating tests
- `chore/description` - Maintenance tasks

**Examples:**
```bash
git checkout -b feature/user-dashboard
git checkout -b fix/email-verification-bug
git checkout -b docs/contributing-guide
```

### Making Changes

1. **Create a new branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our [Code Standards](#code-standards)

3. **Test your changes** thoroughly

4. **Format and lint** your code:
   ```bash
   bun run format  # Auto-format with Biome
   bun run lint    # Check for issues
   ```

5. **Commit your changes** following our [Commit Guidelines](#commit-guidelines)

---

## Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through Biome.

### Quick Commands

```bash
bun x ultracite fix      # Auto-fix formatting and linting issues
bun x ultracite check    # Check for issues without fixing
bun x ultracite doctor   # Diagnose setup problems
```

### Core Principles

#### Type Safety
- Use explicit types for function parameters and return values
- Prefer `unknown` over `any` for truly unknown types
- Use const assertions (`as const`) for immutable values
- Leverage TypeScript's type narrowing instead of type assertions

#### Modern JavaScript/TypeScript
- Use arrow functions for callbacks
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Use `const` by default, `let` only when reassignment is needed

#### React Best Practices
- Use function components over class components
- Call hooks at the top level only
- Specify all dependencies in hook dependency arrays
- Use the `key` prop for elements in iterables (prefer unique IDs)

#### Accessibility
- Provide meaningful alt text for images
- Use proper heading hierarchy (`h1` → `h2` → `h3`)
- Add labels for form inputs
- Use semantic HTML elements

### Icons and UI Components

**Icons (non-negotiable):**
- Use **HugeIcons only**: `@hugeicons/react` and `@hugeicons/core-free-icons`
- **Never use** `lucide-react`

```tsx
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";

export function Example() {
  return (
    <HugeiconsIcon
      icon={Notification03Icon}
      size={24}
      color="currentColor"
      strokeWidth={1.5}
    />
  );
}
```

**Loading States:**
- Always use `<Spinner />` from `@/components/ui/spinner`
- Never create custom spinners

```tsx
import { Spinner } from "@/components/ui/spinner";

<Button disabled={isLoading}>
  {isLoading ? <Spinner size={15} /> : <Icon />}
  {isLoading ? "Loading..." : "Click me"}
</Button>
```

For complete code standards, see [AGENTS.md](./AGENTS.md).

---

## Commit Guidelines

We follow **Conventional Commits** to maintain a clean and meaningful commit history.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes

### Examples

```bash
feat(auth): add email verification flow
fix(dashboard): correct user stats calculation
docs(readme): update installation instructions
refactor(components): simplify button component logic
```

### Commit Message Rules

- Use the imperative mood ("add" not "added")
- Keep the subject line under 72 characters
- Capitalize the subject line
- Do not end the subject line with a period
- Separate subject from body with a blank line
- Use the body to explain what and why, not how

---

## Pull Request Process

### Before Submitting

1. Ensure your code follows our code standards
2. Run the linter and formatter:
   ```bash
   bun x ultracite fix
   bun run lint
   ```
3. Test your changes thoroughly
4. Update documentation if needed
5. Ensure your branch is up to date with `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

### Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub with:
   - Clear, descriptive title
   - Detailed description of changes
   - Link to related issues (if applicable)
   - Screenshots/videos for UI changes

3. **PR Title Format:**
   ```
   type(scope): brief description
   ```

   Examples:
   - `feat(auth): implement OAuth login`
   - `fix(dashboard): resolve data loading issue`

4. **PR Description Template:**
   ```markdown
   ## Summary
   Brief description of what this PR does.

   ## Changes
   - Change 1
   - Change 2
   - Change 3

   ## Related Issues
   Closes #123

   ## Screenshots (if applicable)
   [Add screenshots here]

   ## Checklist
   - [ ] Code follows project standards
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] Commits follow conventional commits
   - [ ] No console errors
   ```

### Review Process

- All PRs require at least one approval before merging
- Address all review comments
- Keep your PR up to date with `main`
- Be patient and respectful during reviews
- Reviewers will focus on:
  - Code quality and standards
  - Functionality and correctness
  - Performance implications
  - Security considerations
  - Test coverage

### After Approval

Once approved, a maintainer will merge your PR. Thank you for your contribution!

---

## Project Structure

```
www.itlearn.be/
├── app/                    # Next.js app router
│   ├── [lang]/            # Internationalized routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── lib/                   # Utilities and libraries
│   ├── auth/             # Authentication logic
│   ├── emails/           # Email templates and sending
│   └── i18n/             # Internationalization
├── public/               # Static assets
├── server/               # Server-side code
│   └── database/         # Database schemas and config
└── hooks/                # Git hooks

```

### Key Technologies

- **Framework:** Next.js 16.1.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, shadcn/ui
- **Authentication:** Better Auth
- **Database:** PostgreSQL with Prisma ORM
- **Email:** Resend + React Email
- **Code Quality:** Biome (via Ultracite)
- **Icons:** HugeIcons
- **Animation:** Motion (Framer Motion)

---

## Testing

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

### Writing Tests

- Place test files next to the code they test
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies appropriately

---

## Reporting Issues

### Before Creating an Issue

1. Check if the issue already exists
2. Verify you're using the latest version
3. Ensure it's reproducible
4. Gather relevant information

### Issue Template

When creating an issue, include:

**Bug Reports:**
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/error messages
- Environment details (OS, Node version, etc.)

**Feature Requests:**
- Clear description of the feature
- Use case and benefits
- Potential implementation approach
- Examples from other projects (if applicable)

---

## Getting Help

If you need help:

- Check existing documentation
- Search closed issues and PRs
- Ask questions in discussions
- Reach out to maintainers

---

## Recognition

All contributors will be recognized in our project. We appreciate every contribution, no matter how small!

---

## License

By contributing to ITLearn, you agree that your contributions will be licensed under the project's [License](./LICENSE).

---

Thank you for contributing to ITLearn! Your efforts help make this project better for everyone.
