# AGENTS.md - Multi-Project Development Workspace Guide

This workspace contains multiple development projects. This guide provides essential information for developers working across these projects.

## 🏗️ Workspace Overview

This workspace contains **5 main projects**:

### 1. **agricultura-mvp** 🌱
- **Purpose**: Agricultural accounting system for expense control and profit projections
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, localStorage
- **Status**: MVP ready for client validation
- **Key Features**: Mobile-first design, lot management, expense tracking, profit projections

### 2. **codigofacil** 💼
- **Purpose**: Professional web development services website
- **Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Status**: Production website with comprehensive testing
- **Key Features**: Service portfolio, blog system, pricing calculator, contact forms

### 3. **miniveci** 🌐
- **Purpose**: WordPress hosting and development platform
- **Tech Stack**: Docker, WordPress, MySQL, PHP
- **Status**: Production hosting platform
- **Key Features**: WordPress hosting, performance optimization, backup systems

### 4. **pos-miniveci** 🏪
- **Purpose**: Local-first Point of Sale system for small businesses
- **Tech Stack**: Next.js 15, React, TypeScript, SQLite + PostgreSQL, Drizzle ORM
- **Status**: Active development with offline-first architecture
- **Key Features**: Offline functionality, dual database sync, mobile responsive

### 5. **veci-rapido-pos** 🚀
- **Purpose**: Alternative POS system implementation
- **Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Status**: Development version
- **Key Features**: Similar to pos-miniveci with different architecture

## 🛠️ Technology Stack Summary

### Frontend Frameworks
- **Next.js**: Versions 14-16 used across projects
- **React**: 18-19 depending on project
- **TypeScript**: Standard across all projects

### UI/Styling
- **Tailwind CSS**: Primary styling framework
- **shadcn/ui**: Component library (codigofacil, pos projects)
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library

### Databases
- **SQLite + sql.js**: Local database for POS systems
- **PostgreSQL**: Cloud database for sync
- **localStorage**: Simple persistence (agricultura-mvp)
- **MySQL**: WordPress backend (miniveci)

### Build & Deploy
- **Cloudflare Pages**: Primary deployment platform
- **Vercel**: Alternative deployment
- **Docker**: Containerization (miniveci)
- **Wrangler**: Cloudflare tooling

## 📁 Project Structure Conventions

### Standard Next.js Structure
```
project/
├── src/app/              # App Router pages
├── src/components/       # Reusable components
│   └── ui/              # Base UI components
├── src/lib/             # Utilities and configurations
├── src/hooks/           # Custom React hooks
├── src/types/           # TypeScript type definitions
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

### Key Files to Check in Each Project
- `package.json` - Scripts and dependencies
- `AGENTS.md` - Project-specific guidelines
- `README.md` - Project documentation
- `.env.example` - Environment variables template

## 🚀 Development Workflow

### Getting Started with Any Project
1. Navigate to project directory: `cd [project-name]`
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env.local`
4. Start development: `npm run dev`

### Common Scripts Across Projects
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Code linting
- `npm run type-check` - TypeScript checking

### Project-Specific Scripts
- **agricultura-mvp**: `npm run dev-mobile` - Mobile network access
- **codigofacil**: `npm run test` - Jest testing suite
- **pos-miniveci**: `npm run db:migrate` - Database migrations

## 🧪 Testing Standards

### CodigoFacil Testing Protocol (Apply to Other Projects)
- **Jest + React Testing Library** for component testing
- **Coverage requirement**: Minimum 80% for critical components
- **Test structure**: `src/__tests__/` directory
- **Mocking**: Use `src/__mocks__/` for external dependencies

### Testing Commands
```bash
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run test:ci       # CI/CD testing
```

## 🎨 UI/UX Guidelines

### Design Principles
- **Mobile-first**: All projects prioritize mobile experience
- **Accessibility**: Use Radix UI for accessible components
- **Consistency**: Follow shadcn/ui patterns where applicable
- **Performance**: Optimize for fast loading and interaction

### Component Development
1. Use TypeScript for all components
2. Implement proper prop validation
3. Follow shadcn/ui patterns for consistency
4. Include JSDoc comments for complex components
5. Use Tailwind CSS for styling

### Responsive Breakpoints
```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

## 📦 Package Management

### Dependency Guidelines
- Use **exact versions** for critical dependencies
- Keep **React** and **Next.js** versions aligned where possible
- Use **TypeScript 5+** across all projects
- Prefer **npm** over other package managers for consistency

### Common Dependencies
- `clsx` - Conditional CSS classes
- `class-variance-authority` - Component variants
- `lucide-react` - Icon library
- `tailwind-merge` - Tailwind class merging
- `zod` - Runtime type validation

## 🔄 Version Control Best Practices

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Emergency fixes

### Commit Messages
```
feat: add new component
fix: resolve mobile navigation issue
docs: update API documentation
style: improve button hover states
refactor: optimize database queries
test: add unit tests for auth module
```

## 🚀 Deployment Guidelines

### Cloudflare Pages (Primary)
1. Connect repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `out` or `dist`
4. Configure environment variables
5. Enable preview deployments

### Environment Variables
- Store in `.env.local` for development
- Never commit `.env.local` to version control
- Use `.env.example` as template
- Set production variables in deployment platform

## 🔧 Performance Optimization

### General Guidelines
1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Implement dynamic imports
3. **Bundle Analysis**: Regular bundle size monitoring
4. **Caching**: Leverage browser and CDN caching
5. **Lazy Loading**: Components and routes

### Database Performance (POS Projects)
- Use indexed queries for search operations
- Implement pagination for large datasets
- Optimize sync operations with incremental updates
- Use connection pooling for PostgreSQL

## 🛡️ Security Best Practices

### General Security
- Validate all user inputs
- Use HTTPS everywhere
- Implement proper authentication
- Sanitize database queries
- Keep dependencies updated

### API Security
- Rate limiting on API endpoints
- Input validation with Zod
- Proper error handling (no data leaks)
- CORS configuration
- Environment variable protection

## 📱 Mobile Development

### Mobile-First Approach
1. Design for mobile screens first
2. Use touch-friendly interface elements
3. Optimize for network connectivity issues
4. Implement offline functionality where needed
5. Test on real devices

### Network Access (agricultura-mvp)
- Use `npm run dev-mobile` for client testing
- Ensure same WiFi network for device access
- Configure firewall for port 3000 access
- Test responsiveness on actual mobile devices

## 🗄️ Database Patterns

### Local-First Architecture (POS Projects)
1. **Primary**: SQLite with sql.js in browser
2. **Sync**: PostgreSQL for cloud backup
3. **Conflict Resolution**: Last-write-wins with timestamps
4. **Soft Deletes**: Mark records as deleted, don't remove

### Schema Design
- Use UUIDs for primary keys
- Include `created_at`, `updated_at`, `deleted_at` timestamps
- Implement proper foreign key relationships
- Use appropriate data types for performance

## 🎯 Project-Specific Guidelines

### Agricultura MVP
- Focus on **mobile-first** design
- Use **localStorage** for data persistence
- Implement **offline-capable** functionality
- Prioritize **agricultural workflows**

### CodigoFacil
- Maintain **high test coverage** (80%+)
- Use **Jest for testing**
- Implement **SEO optimization**
- Follow **professional design standards**

### MiniVeci
- Focus on **WordPress hosting**
- Optimize for **performance**
- Implement **backup strategies**
- Monitor **server resources**

### POS Projects
- Prioritize **offline functionality**
- Implement **dual database sync**
- Focus on **transaction speed**
- Design for **point-of-sale workflows**

## 🔍 Debugging & Troubleshooting

### Common Issues
1. **Port conflicts**: Use different ports for concurrent development
2. **Environment variables**: Check `.env.local` configuration
3. **Build errors**: Verify TypeScript and linting
4. **Mobile access**: Confirm network and firewall settings
5. **Database issues**: Check connection strings and migrations

### Development Tools
- **Browser DevTools**: Primary debugging
- **Next.js DevTools**: React component inspection
- **Database clients**: For database debugging
- **Network monitoring**: For API and sync issues

## 📚 Documentation Standards

### Code Documentation
- Use **JSDoc** for functions and classes
- Include **README.md** in each project
- Maintain **AGENTS.md** for development guidelines
- Document **API endpoints** and **database schemas**

### Architecture Documentation
- Document major architectural decisions
- Maintain dependency upgrade logs
- Record performance optimization results
- Include deployment procedures

## 🤝 Team Collaboration

### Code Review Guidelines
1. **Functionality**: Does the code work as intended?
2. **Standards**: Follows project conventions?
3. **Performance**: No unnecessary performance impacts?
4. **Security**: No security vulnerabilities?
5. **Testing**: Adequate test coverage?

### Knowledge Sharing
- Update this AGENTS.md when adding new patterns
- Document lessons learned from debugging
- Share performance optimization techniques
- Maintain project-specific guidelines

---

## 📋 Quick Reference Checklist

### Before Starting Development
- [ ] Read project-specific AGENTS.md
- [ ] Install dependencies: `npm install`
- [ ] Set up environment variables
- [ ] Verify development server starts
- [ ] Check mobile access (if applicable)

### Before Committing Code
- [ ] Run linting: `npm run lint`
- [ ] Check TypeScript: `npm run type-check`
- [ ] Run tests: `npm run test` (if available)
- [ ] Verify build works: `npm run build`
- [ ] Test mobile responsiveness

### Before Deployment
- [ ] Test production build locally
- [ ] Verify environment variables
- [ ] Check database migrations (if applicable)
- [ ] Test critical user flows
- [ ] Monitor performance after deployment

---

**Last Updated**: Created from workspace analysis
**Maintained by**: Development Team
**Next Review**: Update as projects evolve

*This guide serves as the foundation for development across all projects in this workspace. Each project may have additional specific guidelines in their respective AGENTS.md files.*