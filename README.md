# PlanPlus 📝🚀

Hey there! 👋 Welcome to **PlanPlus**, a gamified to-do list app designed to make your daily tasks a little more fun and engaging. This project combines functionality with a bit of flair, aiming to enhance productivity while keeping users motivated through rewards and achievements.

Live demo: https://plan-plus.vercel.app/

---

## 🌟 Features
- **Task Management**:  
  Organize tasks by categories, set due dates, and prioritize them for better workflow management.

- **Gamification**:  
  Make task completion rewarding with points and achievement badges. The more you complete, the more you unlock!

- **Achievements**:  
  Celebrate your productivity milestones by earning badges. From completing your first task to hitting major goals, there's always something to aim for. 🏅

- **Statistics**:  
  Get detailed insights into your productivity trends. Track your progress over time with intuitive visualizations that help you stay on top of your game.

- **Clean and Intuitive UI**:  
  Designed with simplicity and usability in mind, PlanPlus ensures a seamless user experience across devices. Responsive, fast, and aesthetically pleasing. 🌈

**Note**: Streak tracking is out! It was fun, but it didn't make the cut. 😉

---

## 🚧 Work in Progress
⚠️ **Heads up**: This project is still in development! Some features might be incomplete, and new updates are on the way. Feel free to check back later for improvements and more functionality.

---

## 🛠️ Tech Stack
- **Frameworks & Libraries**:  
  Built with **Next.js 15** and **React 19**.  
  Both **Server-Side Rendering (SSR)** and **Client-Side Rendering (CSR)** are used to optimize performance and SEO.

- **Styling**:  
  Styled with **Tailwind CSS** and **DaisyUI** to deliver a modern, responsive design that looks great on any screen size.

- **TypeScript**:  
  Ensures type safety and scalability, making the codebase more robust and easier to maintain.

- **Data Validation**:  
  **Zod** is used to handle data validation effortlessly, ensuring that only clean and correct data gets through.

- **Database**:  
  **PostgreSQL** is the backbone for data storage, managed through **Prisma ORM** for seamless database operations.

- **Authentication**:
  **NextAuth.js** provides secure authentication with support for credentials and OAuth providers.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/mohi-az/PlanPlus.git
cd PlanPlus
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` and fill in your configuration:
- \`AUTH_SECRET\`: Generate with \`openssl rand -base64 32\`
- \`DATABASE_URL\`: Your PostgreSQL connection string
- \`AUTH_GITHUB_ID\` & \`AUTH_GITHUB_SECRET\`: (Optional) For GitHub OAuth

4. **Set up the database**
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. **Run the development server**
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

\`\`\`
PlanPlus/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── actions/      # Server actions
│   │   ├── api/          # API routes
│   │   └── members/      # Protected member pages
│   ├── lib/              # Utility functions and components
│   │   ├── components/   # Reusable React components
│   │   ├── constants.ts  # Application constants
│   │   ├── logger.ts     # Logging utility
│   │   └── env.ts        # Environment validation
│   ├── contexts/         # React contexts
│   ├── types/            # TypeScript type definitions
│   └── prisma.ts         # Prisma client instance
├── prisma/               # Database schema
├── __tests__/            # Test files
└── public/               # Static assets
\`\`\`

---

## 🧪 Testing

Run the test suite:
\`\`\`bash
npm test
\`\`\`

Run tests in watch mode:
\`\`\`bash
npm test -- --watch
\`\`\`

---

## 🔒 Security

PlanPlus takes security seriously. Please review our [Security Policy](SECURITY.md) for:
- Reporting vulnerabilities
- Security best practices
- Supported versions

Key security features:
- ✅ Environment variable validation
- ✅ SQL injection protection via Prisma
- ✅ XSS protection via React
- ✅ Secure password hashing with bcrypt
- ✅ Proper error handling without exposing sensitive data
- ✅ Input validation with Zod schemas

---

## 📝 Code Quality

This project follows best practices for maintainable code:

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js and TypeScript rules
- **Logging**: Structured logging with environment-aware logger
- **Error Handling**: Consistent error handling with proper logging
- **Constants**: Centralized constants for better maintainability
- **Testing**: Jest and React Testing Library for unit tests

### Running Code Quality Checks

\`\`\`bash
# Lint the code
npm run lint

# Check for security vulnerabilities
npm audit

# Build the project
npm run build
\`\`\`

---

## 🐳 Docker Deployment

Build and run with Docker:

\`\`\`bash
# Build the image
docker build -t planplus .

# Run the container
docker run -p 8080:8080 --env-file .env planplus
\`\`\`

The Dockerfile uses multi-stage builds and runs as a non-root user for enhanced security.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Make your changes following the code style
4. Run tests and linting
5. Commit your changes (\`git commit -m 'Add amazing feature'\`)
6. Push to the branch (\`git push origin feature/amazing-feature\`)
7. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 🧑‍💻 Why I Built This

PlanPlus is more than just a to-do list app. It's a personal project that showcases my skills in modern web development. Here's why it stands out:

- Clean and maintainable React/Next.js components for both SSR and CSR
- A sleek and intuitive user interface styled with Tailwind CSS and DaisyUI
- Strong emphasis on type safety and data validation using TypeScript and Zod
- A robust backend powered by PostgreSQL and Prisma for seamless database management
- Professional error handling and logging
- Secure authentication and data management
- This project reflects my coding philosophy: simplicity, scalability, and a focus on user experience

---

## 📄 License

This project is available under the ISC License.

---

## 🙏 Acknowledgments

- Next.js and React teams for amazing frameworks
- Prisma for the excellent ORM
- All open-source contributors

---

Thanks for stopping by! If you like what you see, feel free to connect or drop a star ⭐️ on the repo.
Happy coding! 💻🚀
