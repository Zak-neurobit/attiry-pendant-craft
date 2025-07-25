
# Component Inventory - Attiry E-commerce

## Layout Components

### Header (`src/components/Header.tsx`)
**Purpose**: Main navigation header with logo, menu, and user actions
**Features**:
- Attiry logo in Great Vibes font (black, responsive sizing)
- Navigation links (Home, Shop, About, FAQ)
- Shopping cart with item count badge
- Favorites/wishlist with count badge
- User authentication dropdown
- Admin button (visible only to admin users)
- Mobile hamburger menu
**Props**: None (uses global state)
**Dependencies**: useAuth, useCart, useFavourites stores

### Footer (`src/components/Footer.tsx`)
**Purpose**: Site footer with links and branding
**Features**: 
- Company information and links
- Updated Attiry logo branding
**Status**: Updated with new logo

### Layout (`src/components/layout/Layout.tsx`)
**Purpose**: Main layout wrapper with header and footer
**Features**: Consistent page structure with Outlet for page content

## Product Components

### ProductCard (`src/components/ProductCard.tsx`)
**Purpose**: Product display card for shop grid
**Features**:
- Product image with hover effects
- Price display with sale pricing
- Star ratings and review counts
- Color variant indicators
- Favorite toggle button
- New/Sale badges
**Props**: `{ product: Product }`
**Navigation**: Links to `/product/${product.slug}`

### Product Detail Page (`src/pages/ProductDetail.tsx`)
**Purpose**: Individual product page with customization
**Features**:
- Product image gallery
- Customization options (name, font, color, chain)
- Add to cart functionality
- Product tabs (details, shipping, reviews)
- Trust badges and guarantees
**Route**: `/product/:slug`
**Size**: 421 lines (needs refactoring consideration)

## Authentication Components

### LoginForm (`src/components/auth/LoginForm.tsx`)
**Purpose**: User login interface
**Features**:
- Email/password authentication
- Rate limiting protection
- Password visibility toggle
- Special handling for admin emails
- Error handling with toast notifications
**Security**: Input validation, attempt limiting

### AuthPage (`src/components/auth/AuthPage.tsx`)
**Purpose**: Authentication page wrapper
**Status**: Handles login/signup routing

### AdminLogin (`src/components/admin/AdminLogin.tsx`)
**Purpose**: Admin-specific login interface
**Features**: Enhanced security for admin access

## Shop & Catalog

### Shop Page (`src/pages/Shop.tsx`)
**Purpose**: Main product catalog page
**Features**:
- Grid layout of product cards
- 12 custom name pendant products
- Animated product entry
- Call-to-action for custom designs
**Route**: `/shop`
**Size**: 227 lines (needs refactoring consideration)

### Product Data (`src/lib/products.ts`)
**Purpose**: Product data definitions and utilities
**Features**:
- Product interface definitions
- 12 pendant products with complete data
- Utility functions (getProductBySlug, getProductById)
- Price, rating, and variant information

## State Management

### Authentication Store (`src/stores/auth.ts`)
**Purpose**: Global authentication state
**Features**:
- User session management
- Admin role detection
- Sign in/out functionality
- Supabase Auth integration
**Methods**: signIn, signUp, signOut, initialize

### Cart Store (`src/stores/cart.ts`)
**Purpose**: Shopping cart state management
**Features**: Add/remove items, quantity management, cart persistence

### Favourites Store (`src/stores/favourites.ts`)
**Purpose**: Wishlist/favorites management
**Features**: Add/remove favorites, persistence

## Admin Components

### Admin Dashboard (`src/pages/admin/Dashboard.tsx`)
**Purpose**: Admin overview and metrics
**Access**: Restricted to admin users

### Admin Layout (`src/components/admin/AdminLayout.tsx`)
**Purpose**: Admin-specific layout wrapper
**Features**: Admin sidebar and navigation

### Protected Route (`src/components/admin/ProtectedRoute.tsx`)
**Purpose**: Route protection for admin areas
**Security**: Role-based access control

## Utility Components

### SEO Head (`src/components/SEOHead.tsx`)
**Purpose**: Dynamic meta tags and SEO optimization
**Features**: Title, description, OG tags per page

### Toast Notifications (`src/hooks/use-toast.ts`)
**Purpose**: User feedback system
**Features**: Success, error, warning notifications

## Key Hooks

### useProducts (`src/hooks/useProducts.ts`)
**Purpose**: Product data management
**Features**:
- Fetch products from Supabase
- Delete operations (single/bulk)
- Loading and error states
**Dependencies**: Supabase client, toast notifications

### useAuth (`src/stores/auth.ts`)
**Purpose**: Authentication state management
**Features**: Login, logout, session management

## Page Components

### Index/Home (`src/pages/Index.tsx`)
**Purpose**: Homepage/landing page
**Route**: `/`

### About (`src/pages/About.tsx`)
**Purpose**: About page
**Route**: `/about`

### FAQ (`src/pages/FAQ.tsx`)
**Purpose**: Frequently asked questions
**Route**: `/faq`

### Cart (`src/pages/Cart.tsx`)
**Purpose**: Shopping cart review and management
**Route**: `/cart`

### Account (`src/pages/Account.tsx`)
**Purpose**: User account management
**Route**: `/account/*`

## Component Status & Notes

### Recently Updated
1. **Header**: Logo updated to black Great Vibes font, made 15% smaller
2. **ProductCard**: Fixed routing to use product slugs
3. **LoginForm**: Enhanced error handling and admin user support
4. **Shop**: Completely rebuilt with 12 pendant products

### Needs Attention
1. **Large Files**: ProductDetail (421 lines), Shop (227 lines) need refactoring
2. **Static Data**: Products currently use static data, need database integration
3. **Admin Features**: Many admin components exist but need full implementation

### Dependencies
- All components use Tailwind CSS for styling
- shadcn/ui components for consistent UI elements
- Lucide React for icons
- Framer Motion for animations
- React Router for navigation
- Zustand for state management
- Supabase for backend services

---

Last Updated: [Current Date]
Total Components: 30+ active components
