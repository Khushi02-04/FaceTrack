# College ERP System - Frontend Skeleton

A modern, production-ready frontend skeleton for a comprehensive Educational Resource Planning (ERP) system with face recognition attendance tracking capabilities.

## Overview

This is a Next.js 16 based SaaS skeleton designed to serve as the foundation for a complete college management platform. It includes:

- **Authentication System**: Login/signup pages with context-based auth management
- **Responsive Dashboard**: Modern UI with sidebar navigation and top navigation bar
- **12+ Modules**: Pre-configured routes for all major institutional management features
- **Face Recognition Ready**: Dedicated attendance module with face recognition integration points
- **Dark Mode Support**: Full dark/light theme support via next-themes
- **Type-Safe**: 100% TypeScript with strict mode enabled
- **Production Architecture**: Ready for database and API integration

## Project Structure

```
app/
├── (auth)/                      # Authentication route group
│   ├── login/                   # Login page
│   ├── signup/                  # Sign up page
│   └── layout.tsx               # Auth layout with centered form
├── (dashboard)/                 # Protected dashboard route group
│   ├── layout.tsx               # Dashboard wrapper with sidebar/topbar
│   ├── page.tsx                 # Dashboard home with stats & quick actions
│   ├── students/                # Student management
│   ├── teachers/                # Teacher management
│   ├── academics/               # Courses and classes
│   ├── timetable/               # Schedule management
│   ├── attendance/              # Attendance with face recognition
│   ├── analytics/               # Performance analytics
│   ├── reports/                 # Report generation
│   ├── documents/               # Document management
│   ├── notifications/           # Notification center
│   └── settings/                # System settings
├── layout.tsx                   # Root layout with providers
└── page.tsx                     # Landing page

components/
├── layout/
│   ├── sidebar.tsx              # Collapsible sidebar with menu
│   ├── topbar.tsx               # Top navigation with user menu
│   ├── breadcrumb.tsx           # Dynamic breadcrumb navigation
│   └── dashboard-layout.tsx     # Main dashboard wrapper
├── navigation/
│   ├── nav-item.tsx             # Individual menu item component
│   └── nav-menu.tsx             # Menu container
├── auth/
│   └── auth-guard.tsx           # Protected route wrapper
└── ui/                          # shadcn UI components (pre-installed)

hooks/
├── useAuth.ts                   # Authentication context and hook
├── useSidebar.ts                # Sidebar state management
└── useTenant.ts                 # Institution/tenant context

lib/
├── api.ts                       # API client for backend integration
├── constants.ts                 # Menu items and app constants
├── providers.tsx                # Global providers wrapper
└── utils.ts                     # Utility functions (cn, etc.)

types/
├── auth.ts                      # Authentication types
└── common.ts                    # Common types (Menu, Tenant, API responses)
```

## Quick Start

### Installation

```bash
# Using the shadcn CLI (recommended)
npm install
npm run dev
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Default Login Credentials

For development, use any credentials (mock auth is configured):
- **Email**: admin@college.edu
- **Password**: password

## Key Features

### 1. Authentication System
- Dual context-based auth (AuthProvider, TenantProvider)
- Mock authentication for development
- Ready for real auth provider integration (Supabase, Auth.js, etc.)
- Session persistence via localStorage
- Protected routes with AuthGuard component

### 2. Dashboard Layout
- **Responsive Sidebar**: Collapsible navigation with icons and labels
- **Smart Topbar**: Search, notifications, theme toggle, user menu
- **Dynamic Breadcrumb**: Auto-generated from current route
- **Mobile First**: Full mobile responsiveness with touch-friendly sidebar toggle

### 3. Navigation System
- Hierarchical menu structure with parent/child items
- Active route highlighting
- Badge support for unread/pending items
- Smooth expand/collapse animations
- Icon support via Lucide React

### 4. Modules Included
1. **Dashboard** - Home page with stats and quick actions
2. **Students** - Student information and management
3. **Teachers** - Faculty management
4. **Academics** - Course and class management
5. **Timetable** - Schedule creation and management
6. **Attendance** - With dedicated face recognition section
7. **Analytics** - Performance metrics and insights
8. **Reports** - Report generation and export
9. **Documents** - File and document management
10. **Notifications** - Alert and notification center
11. **Settings** - System and user preferences

### 5. Design System
- **Color Tokens**: CSS variables for theming
- **Dark Mode**: Full support via next-themes
- **Responsive Grid**: Mobile-first Tailwind design
- **Component Library**: Pre-configured shadcn/ui components
- **Icons**: Lucide React for consistent iconography
- **Spacing Scale**: Consistent Tailwind spacing

## Architecture Patterns

### State Management
- **Auth Context**: User and authentication state
- **Sidebar Context**: Navigation UI state with localStorage persistence
- **Tenant Context**: Institution/college information
- Ready for Redux/Zustand if needed

### Routing
- **Route Groups**: Using (auth) and (dashboard) for layout separation
- **Protected Routes**: AuthGuard wrapper for dashboard
- **Nested Routes**: Support for sub-modules and hierarchical navigation

### Components
- **Composition Pattern**: Small, composable components
- **Container/Presentational**: Separation of concerns
- **Server/Client Split**: Optimal performance with Next.js 16

## Integration Points

### Ready for Integration
- **Database**: API client (lib/api.ts) ready for backend
- **Authentication**: Replace mock auth with Supabase, Auth.js, etc.
- **File Storage**: Document module ready for Vercel Blob or S3
- **Face Recognition**: Attendance module has dedicated section
- **Real-time Updates**: Structure ready for WebSocket/SSE
- **Payments**: Settings module ready for subscription features

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Customization

### Adding New Modules
1. Create folder in `app/(dashboard)/module-name/`
2. Add `page.tsx` with your content
3. Add menu item to `DASHBOARD_MENU_ITEMS` in `lib/constants.ts`
4. Navigation updates automatically

### Changing Colors
Edit design tokens in `globals.css`:
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96%;
  /* ... more tokens ... */
}
```

### Customizing Navigation
Edit `lib/constants.ts` to modify:
- Menu items and structure
- Icons and labels
- Badge numbers
- Nested sub-menus

## Security Notes

- **Current Auth**: Mock only - for development use
- **Protected Routes**: Implemented with AuthGuard wrapper
- **Session Management**: Ready for secure session handling
- **Data Validation**: API client includes error handling
- **CORS**: Ready for backend configuration

## Performance Optimizations

- Server-side rendering with selective client components
- Code splitting at route boundaries
- Image optimization ready
- CSS-in-JS with minimal runtime
- Lazy loading for navigation items

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Tips

### Add Console Logging
Use the pattern `console.log("[v0]", ...)` for debugging:
```typescript
console.log("[v0] User data:", user);
```

### Test Protected Routes
Visit `/dashboard` without logging in to test AuthGuard redirection.

### Theme Testing
Toggle dark mode with the sun/moon icon in the topbar.

### Mobile Testing
Use browser DevTools responsive mode or physical device with `npm run dev` exposed.

## Next Steps

1. **Database Integration**: Connect to Supabase, Neon, or custom API
2. **API Implementation**: Replace mock auth with real endpoints
3. **Module UI**: Build detailed UIs for each module (ready for chunk-based generation)
4. **Face Recognition**: Integrate computer vision library for attendance
5. **Real-time Features**: Add WebSocket for live updates
6. **Testing**: Add unit and E2E tests with Jest/Playwright
7. **Deployment**: Deploy to Vercel with environment variables

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes
- **Form Handling**: React hooks (ready for React Hook Form)
- **State**: React Context (ready for Redux/Zustand)
- **Package Manager**: pnpm

## Support & Resources

- [Next.js Documentation](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

## License

This project is created with v0.app and is ready for customization and deployment.

---

Built with v0 - The AI-powered frontend builder for developers and designers.
