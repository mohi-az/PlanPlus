# Contributing to PlanPlus

First off, thank you for considering contributing to PlanPlus! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/PlanPlus.git
   cd PlanPlus
   ```
3. **Set up the upstream remote**:
   ```bash
   git remote add upstream https://github.com/mohi-az/PlanPlus.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up your environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
6. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Development Workflow

1. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes** following the coding standards

3. **Test your changes**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit your changes** following the commit guidelines

5. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```

6. **Open a Pull Request** on GitHub

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid using `any` types - use proper typing or `unknown` when necessary
- Enable strict type checking

### Code Style

- Follow the ESLint configuration
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### File Organization

- Place React components in `src/lib/components/` or `src/app/`
- Server actions go in `src/app/actions/`
- Utility functions in `src/lib/`
- Types in `src/types/`

### Best Practices

- **Error Handling**: Use try-catch blocks and log errors properly using the logger utility
- **Constants**: Use constants from `src/lib/constants.ts` instead of magic strings
- **Validation**: Use Zod schemas for input validation
- **Logging**: Use the logger utility instead of console.log
- **Security**: Never expose sensitive information in logs or error messages

### React/Next.js

- Use Server Components by default, Client Components only when needed
- Follow React Hooks rules
- Use proper dependency arrays in useEffect/useCallback
- Implement proper loading and error states

## Commit Guidelines

We follow conventional commit messages for clarity:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(tasks): add task filtering by category

fix(auth): resolve login redirect issue

docs(readme): update installation instructions

refactor(actions): improve error handling in userActions
```

## Pull Request Process

1. **Update Documentation**: Update README.md or other docs if needed
2. **Add Tests**: Add tests for new features
3. **Run Tests**: Ensure all tests pass
4. **Update CHANGELOG**: Add your changes to CHANGELOG.md (if exists)
5. **Code Review**: Wait for review and address feedback
6. **Merge**: Once approved, your PR will be merged

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] Tests added/updated and passing
- [ ] Linting passes without errors
- [ ] Documentation updated if needed
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] Security considerations addressed

## Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node version, browser (if applicable)
6. **Screenshots**: If applicable
7. **Error Logs**: Any relevant error messages

## Suggesting Enhancements

We welcome feature suggestions! Please include:

1. **Use Case**: Describe the problem this solves
2. **Proposed Solution**: Your suggestion for implementation
3. **Alternatives**: Other solutions you've considered
4. **Additional Context**: Any other relevant information

## Questions?

If you have questions, feel free to:
- Open an issue with the "question" label
- Reach out to the maintainers

---

Thank you for contributing to PlanPlus! 🚀
