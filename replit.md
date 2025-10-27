# Plot Management CRM

## Overview
This is a full-featured Plot Management CRM web application for real estate businesses. It manages leads, salespersons, projects, plots, bookings, and payments. The application features a modern UI with a blue-gold color scheme, glassmorphism effects, and supports role-based access control for Admin and Salesperson roles, each with distinct dashboards and capabilities. The business vision is to provide a comprehensive tool for real estate management, enhancing efficiency in lead conversion, project oversight, and sales team performance.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework & Build Tool**: React 18 with TypeScript, Vite for fast development.
- **Routing**: Wouter for lightweight client-side routing.
- **UI Component System**: ShadCN/UI (built on Radix UI) and Tailwind CSS for styling with stunning modern design. Features include:
  - **Glassmorphism Effects**: Transparent, blurred glass-like cards with beautiful shadows
  - **Animated Gradients**: Flowing multi-color gradients on headers and backgrounds
  - **Smooth Animations**: Fade-in, slide-up, scale-in, and float effects throughout
  - **Modern Card Design**: Gradient-bordered cards with hover effects that lift and glow
  - **Visual Flourishes**: Sparkle icons, pulse effects, and animated loading states
  - **Responsive Design**: Mobile-first approach with optimized layouts
  - **Light/Dark Mode**: Full theme support with proper color variants
- **State Management**: TanStack Query for server state, React Context API for authentication and theme, React Hook Form with Zod for form handling and validation.

### Backend Architecture
- **Server Framework**: Express.js with TypeScript on Node.js, implementing a RESTful API.
- **Authentication & Authorization**: JWT for stateless authentication (stored in localStorage), bcryptjs for password hashing, custom middleware for role-based access control (Admin/Salesperson).
- **API Architecture**: Organized route handlers, middleware for authentication (`authenticateToken`) and admin-only routes (`requireAdmin`), and Zod schemas for request validation.

### Data Storage
- **Database**: MongoDB with Mongoose ODM for schema-based data modeling.
- **Data Models**:
    - **User**: Admin and salesperson accounts.
    - **Lead**: Customer leads with contact info, status, rating (Urgent/High/Low), source, classification (Inquiry/Important), salesperson assignment, and assignedBy tracking.
    - **Project**: Real estate projects.
    - **Plot**: Individual plots with details like size, price, status (Available/Booked/Hold/Sold), and category.
    - **BuyerInterest**: Tracks potential buyers for plots, including offered price and assigned salesperson.
    - **Payment**: Booking payments with amount, mode, and type.
    - **CallLog**: Records salesperson call activities with lead details, call status (Interested/Not Interested/Call Back/Meeting Scheduled), duration, notes, and next follow-up date.
    - **ActivityLog**: Audit trail of user actions.
- **Schema Design**: TypeScript interfaces and Zod validation schemas shared between frontend and backend.

### System Design Choices
- **Real-Time Updates**: WebSocket implementation with JWT authentication for instant data synchronization across all connected clients. Uses SESSION_SECRET environment variable with fail-fast security validation. Automatic query cache invalidation ensures UI updates without page refreshes.
- **Login Experience**: Stunning login page with:
  - Professional aerial background image of real estate plots
  - Animated gradient overlays with floating particle effects
  - Glassmorphism card design with blur effects
  - Gradient button with arrow animation on hover
  - Pulsing sparkle icons and floating logo animation
  - Demo credentials clearly displayed in glass container
- **Stunning Dashboards**: Beautiful, modern dashboards with amazing visual effects:
  - **Admin Dashboard**: 
    - Animated gradient hero header with floating decorative elements
    - Large metric cards with gradient text numbers and floating icon animations
    - Glassmorphism cards with smooth hover effects (lift and shadow)
    - Color-coded gradient icons for each metric (blue/cyan, green/emerald, purple/pink, amber/orange)
    - Performance cards with gradient backgrounds and smooth transitions
    - Staggered fade-in animations for sequential loading effect
  - **Salesperson Dashboard**:
    - Animated gradient hero with personalized greeting
    - Clean metric cards with gradient numbers and pulsing important stats
    - Enhanced follow-up cards with gradient badges and profile circles
    - "Call Now" buttons with gradient backgrounds
    - Empty state with celebration icons when all caught up
    - Hover effects that highlight and enlarge cards
  - Clear, descriptive labels and helpful sub-text on all metrics
  - Loading states with animated spinner and sparkle icons
- **Salesperson Performance**: Dedicated `/performance` page with clean cards showing key metrics per salesperson including leads assigned, conversions, conversion rate, buyer interests added, and revenue. Clicking on a salesperson card displays their detailed call activity history with lead information, call status, notes, and follow-up dates.
- **Projects & Plots Management**: Hierarchical table structure for projects, showing plot details, buyer interest counts, highest offers, and assigned salespersons. Category-based plot filtering (Investment Plot, Bungalow Plot, Residential Plot, Commercial Plot, Open Plot).
- **Lead Management**: Enhanced lead creation and editing forms with:
  - Lead classification system (Inquiry vs Important) to help prioritize leads
  - Project/plot interest capture with optional highest offer
  - Salesperson assignment tracking with "Added By" column showing which salesperson created each lead
  - Classification badges (blue for Inquiry, orange for Important) in leads table
  - Admin-only visibility of "Added By" column for oversight and tracking
  - Integration of LeadInterest with BuyerInterest for comprehensive tracking
- **Call Logging System**: Salespersons can log call activities for assigned leads with call status, notes, and next follow-up dates. Duration field is optional. When logging a call with a next follow-up date, the lead's follow-up date is automatically updated.
- **Notification System**: Real-time notification bell for salespersons showing missed follow-ups. Badge displays count of overdue leads, dropdown shows detailed list with lead information. Notifications refresh every minute and clear on logout.
- **Analytics Dashboard**: Comprehensive analytics section for admin users with crisp, business-focused visualizations:
  - Overview metrics cards showing conversion rate, total revenue, active leads, and average response time
  - Daily and monthly performance charts tracking leads, conversions, and revenue trends
  - Lead source distribution analysis showing channel effectiveness
  - Plot category performance metrics
  - Recent activity timeline for monitoring business operations
  - Date range filtering (Today, This Week, This Month, Last 3/6 Months)
  - Export functionality for analytics data (CSV/Excel)
  - Secure admin-only access with explicit role checking and automatic redirects
  - Separated from team performance tracking for clarity - team member details are in the dedicated Performance section
- **Navigation Structure**: Clear, intuitive navigation structure:
  - **Admin Navigation**: Dashboard, Leads, Salespersons, Projects & Plots, Analytics, Performance, and Settings
  - **Salesperson Navigation**: Dashboard, "My Assigned Leads" (clarified naming), Prospect Calls, and "Available Plots" (clarified naming)
  - Navigation labels updated to be crystal clear and eliminate confusion
  - Organized into logical sections with icons for visual identification
- **Data Export**: CSV/Excel export functionality for filtered lead data and analytics reports.

## External Dependencies

### Database Service
- **MongoDB**: NoSQL database. Requires `MONGODB_URI` environment variable.

### Third-Party Libraries
- **Google Fonts**: Inter (primary) and JetBrains Mono (monospace).
- **Radix UI**: Accessible UI component primitives.
- **date-fns**: Date manipulation utilities.
- **Heroicons** (via Lucide React): Icon system.

### Development Tools
- **Drizzle Kit**: Configured but not actively used with MongoDB.
- **ESBuild**: Bundler for backend production builds.
- **TSX**: TypeScript execution for development server.

### Deployment Requirements
- **Environment Variables**: `MONGODB_URI`, `SESSION_SECRET`, `NODE_ENV`.
- **Build Process**: `vite build` for frontend, `esbuild` for backend.