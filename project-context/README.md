
# Attiry - Custom Name Pendant E-commerce Website

## Project Overview
Attiry is a luxury e-commerce website specializing in custom name pendants and jewelry. The website allows users to browse products, customize jewelry with names, and purchase items through a premium shopping experience.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **State Management**: Zustand stores
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Routing**: React Router v6
- **Payments**: Razorpay integration
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Design System

### Typography
- **Logo Font**: Great Vibes (cursive, elegant script)
- **Heading Font**: Playfair Display (serif, luxury)
- **Body Font**: Inter (sans-serif, modern)

### Color Palette
- **Background**: `#F7F4F2` (warm cream)
- **Text Primary**: `#2B2B2B` (dark charcoal)
- **Accent Gold**: `#C4A07A` (luxury gold)
- **CTA Background**: `#000000` (pure black)
- **CTA Text**: `#FFFFFF` (pure white)

### Brand Identity
- **Brand Name**: Attiry
- **Logo**: "Attiry" in Great Vibes font, displayed in black
- **Favicon**: Same "Attiry" text in white on transparent background
- **Style**: Luxury, elegant, premium jewelry brand

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── auth/                  # Authentication components
│   ├── admin/                 # Admin dashboard components
│   ├── layout/                # Layout components (Header, Footer)
│   ├── product/               # Product-related components
│   └── ...
├── pages/                     # Route pages
├── stores/                    # Zustand state stores
├── lib/                       # Utility libraries and data
├── hooks/                     # Custom React hooks
└── integrations/              # Third-party integrations
```

## Key Features Implemented

### 1. Authentication System
- **Provider**: Supabase Auth
- **Methods**: Email/password authentication
- **Admin Access**: Special admin users (zak.seid@gmail.com, zakseid0@gmail.com)
- **Components**: LoginForm, AuthPage, AuthProvider
- **Security**: Rate limiting, input validation, secure session handling

### 2. Product System
- **Product Model**: Custom name pendants with variants (colors, fonts, chains)
- **Catalog**: 12 different pendant designs
- **Customization**: Name input, font selection, color options, chain types
- **Components**: ProductCard, ProductDetail, Shop page

### 3. Navigation & Routing
- **Header**: Sticky navigation with logo, menu, cart, favorites
- **Routes**: Home (/), Shop (/shop), Product pages (/product/:slug)
- **Admin Access**: Admin button visible only to admin users
- **Mobile**: Responsive hamburger menu

### 4. Shopping Features
- **Cart**: Zustand store for cart management
- **Favorites**: Wishlist functionality
- **Product Customization**: Real-time preview of customized products
- **Gift Options**: Gift wrapping selection

### 5. Admin Dashboard
- **Access Control**: Role-based authentication
- **Product Management**: CRUD operations for products
- **Order Management**: Order tracking and fulfillment
- **Analytics**: Sales and performance metrics
- **Payment Integration**: Razorpay payment processing

## Current Implementation Status

### ✅ Completed Features
1. **Logo & Branding**: Great Vibes font implementation across site
2. **Navigation**: Responsive header with admin access control
3. **Product Catalog**: 12 custom pendant products with routing
4. **Authentication**: Login/logout functionality with admin detection
5. **Layout**: Consistent header across all pages
6. **Product Cards**: Grid layout with product information
7. **Routing**: Proper React Router setup with slug-based product pages

### 🔧 Recent Fixes Applied
1. **Product Routing**: Fixed product links to use slugs instead of IDs
2. **Logo Styling**: Made logo black and 15% smaller in header
3. **Authentication**: Enhanced login form with better error handling
4. **Admin Access**: Restricted admin button to specific email addresses

### 🚧 Known Issues to Address
1. **Product Detail Loading**: Ensure product pages load properly from shop
2. **Authentication Flow**: May need additional session management
3. **Database Integration**: Products currently use static data
4. **Payment Processing**: Razorpay integration needs completion

## Database Schema (Supabase)

### Tables in Use
- `profiles`: User profile information
- `user_roles`: Role-based access control
- `products`: Product catalog (to be implemented)
- `orders`: Order management (to be implemented)
- `security_audit_log`: Security event tracking

### Authentication
- Uses Supabase Auth with Row Level Security (RLS)
- Admin roles managed through `user_roles` table
- Profile data linked to auth.users via user_id

## Environment Configuration

### Required Environment Variables
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `RAZORPAY_KEY_ID`: Razorpay public key
- `RAZORPAY_KEY_SECRET`: Razorpay secret key
- `OpenAI_API_Key`: For AI features (optional)

## Development Guidelines

### Component Architecture
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow atomic design principles (atoms → molecules → organisms)
- Keep components focused and single-purpose

### State Management
- Zustand for client-side state (cart, favorites, auth)
- React Query for server state and caching
- Local state for component-specific data

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow design system tokens from index.css
- Implement responsive design mobile-first
- Use semantic color tokens, avoid hardcoded colors

### Code Quality
- ESLint + Prettier for code formatting
- TypeScript for type safety
- Conventional Commits for git history
- Component documentation with JSDoc

## Deployment Notes
- Built with Vite for optimal performance
- Static assets served from public/ directory
- Environment variables configured in deployment platform
- Supabase handles backend infrastructure

## Next Steps Planned
1. Complete database integration for products
2. Implement full payment processing flow
3. Add order management system
4. Enhanced admin dashboard features
5. Performance optimization and testing

---

Last Updated: [Current Date]
Maintained by: AI Development Assistant
