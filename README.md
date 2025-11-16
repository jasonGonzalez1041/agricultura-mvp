# Multi-Project Development Workspace

This repository contains multiple development projects for web development, point-of-sale systems, and agricultural management solutions.

## 🚀 Projects

### 🌱 [Agricultura MVP](./agricultura-mvp/)
Agricultural accounting system for expense control and profit projections.
- **Tech**: Next.js 14, TypeScript, Tailwind CSS, localStorage
- **Features**: Mobile-first design, lot management, expense tracking

### 💼 [CodigoFacil](./codigofacil/)
Professional web development services website.
- **Tech**: Next.js 16, React 19, TypeScript, shadcn/ui
- **Features**: Service portfolio, blog system, testing suite

### 🌐 [MiniVeci](./miniveci/)
WordPress hosting and development platform.
- **Tech**: Docker, WordPress, MySQL, PHP
- **Features**: WordPress hosting, performance optimization

### 🏪 [POS MiniVeci](./pos-miniveci/)
Local-first Point of Sale system for small businesses.
- **Tech**: Next.js 15, SQLite + PostgreSQL, Drizzle ORM
- **Features**: Offline functionality, dual database sync

### 🚀 [Veci Rapido POS](./veci-rapido-pos/)
Alternative POS system implementation.
- **Tech**: Next.js 15, TypeScript, shadcn/ui
- **Features**: Modern POS interface, mobile responsive

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Docker (for MiniVeci)

### Quick Start
1. Choose a project directory:
   ```bash
   cd agricultura-mvp    # or any other project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment:
   ```bash
   cp .env.example .env.local
   ```

4. Start development:
   ```bash
   npm run dev
   ```

## 📚 Documentation

- **[AGENTS.md](./AGENTS.md)** - Comprehensive development guide
- Each project has its own README and documentation

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Code linting
npm run type-check   # TypeScript validation

# Testing (where available)
npm run test         # Run tests
npm run test:coverage # Test coverage
```

## 🏗️ Architecture

- **Frontend**: Next.js with TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Databases**: SQLite (local), PostgreSQL (cloud), MySQL (WordPress)
- **Deployment**: Cloudflare Pages, Vercel

## 🤝 Contributing

1. Read the [AGENTS.md](./AGENTS.md) development guide
2. Follow project-specific guidelines in each directory
3. Maintain consistent coding standards across projects
4. Test thoroughly before committing

---

*Developed for modern web solutions and business automation*