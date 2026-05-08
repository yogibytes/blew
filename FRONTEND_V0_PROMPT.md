# 🎨 Blew Frontend - Comprehensive V0/AI Generation Prompt

## **Project Context**

**Blew** is a Solana payment widget MVP enabling merchants to accept SOL/USDC payments instantly. Building responsive, beautiful frontend components that integrate seamlessly with the production backend API.

**Backend Live:** `https://blew-ten.vercel.app`  
**Tech Stack:** Next.js 16.2.4 | React 18.3.1 | Tailwind CSS 4.2.4 | Recharts 3.8.1 | Zustand 5.0.12

---

## **🎯 Design Philosophy**

- **Color Palette:** Deep blue gradient (#1a1f3a to #0f172a), accent gold (#fbbf24), success green (#10b981)
- **Typography:** Modern sans-serif (Geist), clear hierarchy, 16px base
- **Components:** Responsive across 375px → 768px → 1280px
- **State Management:** Zustand for global state, React hooks for local
- **No Database Changes:** All UI reads from existing API endpoints, no schema modifications

---

## **📋 Database Schema (DO NOT MODIFY)**

```typescript
// ONLY READ from these endpoints - no direct DB writes
Endpoints: {
  GET /api/health
  POST /api/merchants/register → returns {id, apiKey}
  GET /api/merchants/me
  POST /api/merchants/update
  POST /api/payments → returns {id, status, expiresAt}
  GET /api/payments/[id]
  POST /api/payments/[id]/confirm
  GET /api/payments/list
  GET /api/dashboard/stats → {volume, transactions, successRate}
  GET /api/dashboard/chart → {labels, data}
  GET /api/webhooks/logs
}

// Fields that MUST match backend exactly:
Payment: {amount, token (SOL|USDC), status, solanaSignature, expiresAt, metadata}
Merchant: {apiKey, webhookUrl, webhookSecret, totalVolume, transactionCount}
```

---

## **🏗️ Project Structure**

```
packages/api/src/
├── pages/
│   ├── index.tsx → Homepage + Hero
│   ├── dashboard.tsx → Merchant dashboard (existing - enhance)
│   └── _app.tsx → Layout + ThemeProvider
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── ThemeToggle.tsx
│   ├── PaymentWidget/
│   │   ├── PaymentForm.tsx
│   │   ├── PaymentStatus.tsx
│   │   └── PaymentSuccess.tsx
│   ├── Dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── PaymentChart.tsx
│   │   ├── RecentPayments.tsx
│   │   └── DashboardLayout.tsx
│   ├── Auth/
│   │   ├── MerchantLogin.tsx
│   │   └── RegisterForm.tsx
│   └── Common/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Toast.tsx
├── hooks/
│   ├── useApi.ts → API calls wrapper
│   ├── useMerchant.ts → Merchant state (Zustand)
│   ├── usePayment.ts → Payment state
│   ├── useTheme.ts → Theme management
│   └── useResponsive.ts → Breakpoint detection
├── utils/
│   ├── api.ts → Axios/fetch config
│   ├── theme.ts → Color constants
│   ├── formatting.ts → Number/date formatting
│   └── validation.ts → Form validation
├── types/
│   └── index.ts → TypeScript interfaces (read from @blew/types)
└── styles/
    └── globals.css → Tailwind + custom CSS
```

---

## **🎨 Component Specs**

### **1. Header Component**
- Logo + brand name "Blew"
- Navigation (Home, Dashboard, Docs)
- Theme toggle (light/dark)
- Merchant status indicator (API key chip when authenticated)
- Mobile: hamburger menu

### **2. Payment Widget (Main)**
- Amount input (SOL or USDC)
- Token selector dropdown
- Merchant info display
- "Pay Now" button
- Real-time fee calculation
- Countdown timer (payment expires in 15 min)
- Error state with retry

### **3. Dashboard**
- 4 stat cards: Volume, Transactions, Success Rate, Avg Transaction
- 7/30/90 day filter toggle
- Chart showing payment volume trend (Recharts)
- Recent payments table (sortable, paginated)
- Export CSV button

### **4. Authentication Flow**
- Merchant registration form
- Email verification
- Wallet address input
- API key display + copy button
- Login with API key

---

## **📱 Responsive Breakpoints**

```typescript
// Tailwind responsive classes:
- Mobile: < 640px (1 column, 16px padding)
- Tablet: 640px - 1024px (2 columns, 20px padding)
- Desktop: > 1024px (4 columns, 24px padding)

// All components use:
className="w-full md:w-1/2 lg:w-1/4"
```

---

## **🔌 API Integration Rules**

```typescript
// ALWAYS include X-API-Key header for authenticated endpoints:
headers: {
  'X-API-Key': merchantApiKey,
  'Content-Type': 'application/json'
}

// Payment creation request:
POST /api/payments
{
  amount: number,           // Must be > 0
  token: 'SOL' | 'USDC',   // Exact enum
  recipientWallet: string,  // Valid Solana address
  metadata?: {orderId, customerId} // Optional, ANY structure
}

// Response: {id, status: 'pending', expiresAt: ISO8601}
// Status flow: pending → confirmed → completed (or failed)
```

---

## **🎨 Theme System**

```typescript
// Light theme
const lightTheme = {
  bg: '#ffffff',
  bgSecondary: '#f9fafb',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  primary: '#1a1f3a', // Deep blue
  accent: '#fbbf24',  // Gold
  success: '#10b981', // Green
  error: '#ef4444',   // Red
}

// Dark theme
const darkTheme = {
  bg: '#0f172a',
  bgSecondary: '#1a1f3a',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  border: '#374151',
  primary: '#60a5fa', // Light blue
  accent: '#fbbf24',  // Gold
  success: '#10b981',
  error: '#f87171',
}
```

---

## **✅ Quality Checklist**

- [ ] TypeScript strict mode (no `any` types)
- [ ] All API calls wrapped in try/catch
- [ ] Loading states + skeleton loaders
- [ ] Error boundaries on all pages
- [ ] Accessibility (WCAG 2.1 AA): aria-labels, semantic HTML
- [ ] Mobile-first responsive design
- [ ] Dark mode toggle functional
- [ ] Form validation before submission
- [ ] No console warnings/errors
- [ ] Component prop types fully typed
- [ ] No hardcoded URLs (use env vars)
- [ ] All images optimized + lazy loaded

---

## **🚫 Things NOT to Do**

1. ❌ DO NOT modify Prisma schema or create new database models
2. ❌ DO NOT create backend API endpoints (all exist)
3. ❌ DO NOT add fields to Payment/Merchant entities
4. ❌ DO NOT use global CSS (use Tailwind + styled-components)
5. ❌ DO NOT make direct database queries
6. ❌ DO NOT commit node_modules or .next build output
7. ❌ DO NOT change existing component structure
8. ❌ DO NOT use deprecated React patterns (use hooks)
9. ❌ DO NOT hardcode merchant IDs or wallet addresses
10. ❌ DO NOT fetch from non-verified external APIs

---

## **📋 Prompt Todos (End-to-End)**

### **PHASE 1: Setup & Foundation (Day 1)**

**TODO 1.1: Initialize UI Infrastructure**
```
Generate project setup:
- Create folder structure (components, hooks, utils, types)
- Setup Tailwind CSS config from Next.js 16
- Create theme constants (theme.ts)
- Setup API wrapper (utils/api.ts) with base URL from env
- Create TypeScript interfaces (types/index.ts)
```

**TODO 1.2: Create Core Hooks**
```
Build state management:
- useApi() - fetch wrapper with error handling
- useMerchant() - Zustand store for merchant data (apiKey, id, email)
- usePayment() - Zustand store for current payment (amount, token, status)
- useTheme() - localStorage persistence for light/dark mode
- useResponsive() - detect mobile/tablet/desktop
```

**TODO 1.3: Common Components Library**
```
Create reusable components (Tailwind + CVA):
- Button (variants: primary, secondary, danger, loading)
- Card (elevation, hover states)
- Input (text, email, number with validation feedback)
- Modal (centered, overlay, close button)
- Toast (success, error, loading - top-right)
- Badge (color, size variants)
- Spinner (loading indicator)
- Empty State (message + icon)
```

---

### **PHASE 2: Authentication & Merchant Setup (Day 2)**

**TODO 2.1: Merchant Registration**
```
Create RegisterForm.tsx:
- Email input + validation
- Name input
- Solana wallet address input (validation)
- Submit button → POST /api/merchants/register
- Display generated API key with copy button
- Store apiKey in sessionStorage/cookies
- Redirect to dashboard on success
```

**TODO 2.2: Merchant Login**
```
Create MerchantLogin.tsx:
- API Key input field
- Login button → GET /api/merchants/me with X-API-Key header
- Show merchant name + email on successful login
- Store in Zustand + localStorage
- Add logout button to header
```

**TODO 2.3: Header + Navigation**
```
Create Header.tsx:
- Blew logo + brand name (left)
- Navigation links: Home, Dashboard, Docs (center)
- Theme toggle (sun/moon icon)
- Merchant name + logout button (right) when authenticated
- Mobile: hamburger menu, collapse navigation
```

---

### **PHASE 3: Payment Widget (Day 3)**

**TODO 3.1: Payment Form Component**
```
Create PaymentForm.tsx:
- Amount input (number, min 0.01, max 10000)
- Token selector (SOL or USDC buttons)
- Merchant info card (name, wallet address)
- Real-time fee display (if applicable)
- Network indicator (Devnet badge)
- "Create Payment" button
- Form validation before submit
- API call: POST /api/payments
- Store response in usePayment store
- Handle errors with Toast
```

**TODO 3.2: Payment Status Display**
```
Create PaymentStatus.tsx:
- Show payment ID
- Status badge (pending, confirmed, failed)
- Amount + token display
- Recipient wallet address
- Expires in: countdown timer (15 min)
- Copy payment ID button
- Polling: GET /api/payments/[id] every 2 seconds
- Auto-update status when confirmed
```

**TODO 3.3: Payment Success Screen**
```
Create PaymentSuccess.tsx:
- Success checkmark animation
- Payment confirmed message
- Transaction details (amount, wallet, timestamp)
- Button: "View Receipt" or "Continue Shopping"
- Button: "New Payment"
- Dismiss after 30 seconds (optional)
```

**TODO 3.4: Payment Widget Container**
```
Create PaymentWidget.tsx (orchestrator):
- Render PaymentForm OR PaymentStatus OR PaymentSuccess
- State machine: form → status → success
- Error state with retry button
- Loading states during API calls
- Error Toast for failed payments
```

---

### **PHASE 4: Merchant Dashboard (Day 4)**

**TODO 4.1: Stats Cards**
```
Create StatsCard.tsx component:
- Display stat title, value, unit
- Change percentage (up/down indicator)
- Icon (currency, chart, etc.)
- Background color by stat type
- Fetch from: GET /api/dashboard/stats
- Load state with skeleton
- Responsive: 1 col mobile, 2 col tablet, 4 col desktop
```

**TODO 4.2: Payment Chart**
```
Create PaymentChart.tsx:
- Recharts LineChart for payment volume over time
- X-axis: dates, Y-axis: volume (USD)
- 7/30/90 day toggle buttons
- Legend + tooltip
- Responsive container
- Fetch from: GET /api/dashboard/chart?range=7days
- Handle empty data state
```

**TODO 4.3: Recent Payments Table**
```
Create RecentPayments.tsx:
- Table columns: ID, Amount, Token, Status, Date, Action
- Status badge styling (pending, confirmed, failed)
- Pagination: 10 items per page
- Sort by: Date (default), Amount, Status
- Click row → expand for details
- Fetch from: GET /api/payments/list?limit=10&offset=0
- Empty state when no payments
- Loading skeleton for table rows
```

**TODO 4.4: Dashboard Layout**
```
Create DashboardLayout.tsx:
- Sidebar: Navigation, current merchant info, logout
- Top bar: merchant name, stats summary
- Grid layout for stats cards (responsive columns)
- Payment chart section
- Recent payments table
- Export CSV button (optional)
- Protected route: require apiKey in session
```

---

### **PHASE 5: Pages & Integration (Day 5)**

**TODO 5.1: Homepage**
```
Create pages/index.tsx:
- Hero section: "Payments at the speed of wind"
- Feature cards: Fast, Secure, Solana-powered
- Demo payment widget embedded
- Call-to-action: "Get Started"
- Footer: Links, socials
- Responsive hero image
```

**TODO 5.2: Dashboard Page**
```
Enhance pages/dashboard.tsx:
- Check if apiKey in session, else redirect to /register
- Render DashboardLayout component
- Real-time stats polling (refresh every 30 sec)
- Error page if GET /api/merchants/me fails
- Loading page while fetching initial data
```

**TODO 5.3: App Layout**
```
Create pages/_app.tsx:
- Setup ThemeProvider (light/dark mode)
- Setup global error boundary
- Toast notification container
- Persistent layout: Header visible on all pages
- Session management (apiKey from cookies/localStorage)
- Setup Next.js Image optimization
```

---

### **PHASE 6: Styles & Polish (Day 6)**

**TODO 6.1: Global Styles**
```
Create styles/globals.css:
- Tailwind base, components, utilities
- Custom animations (fade, slide, bounce)
- Scrollbar styling (dark theme friendly)
- Font setup (Geist via Next.js)
- CSS variables for theme colors
- Print styles
```

**TODO 6.2: Dark Mode Implementation**
```
- useTheme hook checks localStorage
- Default to system preference
- Toggle persists across sessions
- All components use theme colors
- Smooth transition between themes
- Test on all components
```

**TODO 6.3: Accessibility Audit**
```
- Add aria-labels to buttons
- Ensure color contrast ratio > 4.5:1
- Keyboard navigation (Tab, Enter)
- Form error messages linked to inputs
- Image alt text
- Test with screen reader
```

---

### **PHASE 7: Testing & Deployment (Day 7)**

**TODO 7.1: End-to-End Testing**
```
Manual test scenarios:
1. Register new merchant → get API key
2. Login with API key
3. Create payment (SOL, 0.1)
4. Check payment status updates
5. View dashboard stats
6. Test light/dark mode toggle
7. Test mobile responsive layout (375px)
8. Test form validation errors
9. Test API error handling
10. Test logout + redirect
```

**TODO 7.2: Performance Optimization**
```
- Image optimization (next/image)
- Code splitting (dynamic imports)
- Tree-shake unused Tailwind CSS
- Minify bundle
- Check Lighthouse score > 90
- Measure Core Web Vitals
```

**TODO 7.3: Build & Deploy**
```
- npm run build (should compile without errors)
- npm run lint (no warnings)
- Test on staging/production domain
- Setup error logging (Sentry optional)
- Monitor build size
- Test on real Solana devnet
```

---

## **📦 Dependencies to Use**

```json
{
  "dependencies": {
    "next": "16.2.4",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "zustand": "^5.0.12",
    "recharts": "^3.8.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.4",
    "@types/react": "19.2.14",
    "@types/node": "^20.10.0",
    "tailwindcss": "^4.2.4",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.5.0"
  }
}
```

---

## **🔒 Environment Variables**

```
# .env.local (never commit)
NEXT_PUBLIC_API_URL=https://blew-ten.vercel.app
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_MERCHANT_WALLET=YOUR_WALLET_ADDRESS
```

---

## **📚 Reference Resources**

- Tailwind CSS: https://tailwindcss.com/docs
- CVA (class-variance-authority): https://cva.style/docs
- Recharts: https://recharts.org/
- Next.js 16: https://nextjs.org/docs
- React Hooks: https://react.dev/reference/react/hooks
- Zustand: https://github.com/pmndrs/zustand

---

## **🎯 Success Criteria**

✅ All pages render without errors  
✅ All API calls include proper error handling  
✅ Theme toggle persists across sessions  
✅ Dashboard updates in real-time  
✅ Mobile responsive on 375px viewport  
✅ Forms validate before submission  
✅ No TypeScript errors  
✅ No console warnings  
✅ Lighthouse score > 90  
✅ All routes protected where needed  

---

## **⚠️ Known Constraints**

- Devnet only (no mainnet yet)
- Payment expiry: 15 minutes
- Max transaction size: 10,000 SOL
- Rate limiting: 100 requests/min per API key
- Database schema is FROZEN (no modifications)

---

**Generated:** May 5, 2026  
**Project:** Blew Payment Widget  
**Status:** Ready for V0 generation
