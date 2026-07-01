# Plan: Water Link App (Buyers & Suppliers)

A web application that connects water buyers with water tank suppliers. The app features two distinct interfaces: one for buyers to find and order water, and another for suppliers to manage their listings and orders.

## Scope Summary
- **Landing Page**: Visually appealing entry point with clear paths for "Water Suppliers" and "Users/Buyers".
- **Buyer Experience**: 
  - Browse/search available suppliers.
  - View supplier details and tank offerings.
  - Request/order water flow.
  - Order status tracking.
- **Supplier Experience**:
  - List water tanks with volumes, prices, and delivery areas.
  - Manage incoming requests/orders.
  - Dashboard overview of offerings.
- **Data Persistence**: Client-side only (localStorage) for this session.

## Affected Areas
- **Frontend**: New pages for Landing, Login/Register, Buyer Dashboard, Supplier Dashboard.
- **Components**: UI components (cards, forms, tables) using existing shadcn/ui library.
- **State Management**: React state and localStorage for persistence.

## Assumptions & Open Questions
- **Assumption**: A "mock database" will be used to simulate a backend, persisting data in `localStorage`.
- **Assumption**: Authentication will be simulated; users will choose a role during "signup".
- **Question**: Are there specific pricing models? *Decision: Suppliers can define price per liter/tank size.*

## Phases

### Phase 1: Infrastructure & Data Layer
- Deliverables: Routing setup (`react-router-dom`) and `src/lib/mock-db.ts` for localStorage operations.
- Owner: `frontend_engineer`

### Phase 2: Landing Page & Authentication
- Deliverables: Beautiful landing page with role-based CTA. Simulated Login/Register flow with role selection.
- Owner: `frontend_engineer`

### Phase 3: Buyer Workflow
- Deliverables: Supplier search/listing page. Supplier profile with tank selection. "Order" submission flow.
- Owner: `frontend_engineer`

### Phase 4: Supplier Workflow
- Deliverables: Dashboard for suppliers to add/edit/delete listings. Order management interface (Accept/Reject/Complete).
- Owner: `frontend_engineer`

### Phase 5: UI Refinement & Responsiveness
- Deliverables: Polish CSS, ensure mobile-readiness, and add feedback toasts (sonner).
- Owner: `quick_fix_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build the core application structure, routes, and all primary features for both roles.
2. quick_fix_engineer — Refine UI, fix any styling inconsistencies, and ensure final mobile responsiveness.

**Per-agent instructions:**

### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4
- **Scope:** 
    - Install `react-router-dom` and `lucide-react`.
    - Create `src/lib/mock-db.ts` to manage `users`, `listings`, and `orders` in `localStorage`.
    - Implement `LandingPage` with two clear paths.
    - Implement `BuyerDashboard`: Search input, Supplier cards, Order modal.
    - Implement `SupplierDashboard`: List management (form), Order table.
    - Use shadcn components already present in `src/components/ui`.
- **Files:** 
    - `src/App.tsx` (Routes)
    - `src/pages/Landing.tsx`
    - `src/pages/Auth.tsx`
    - `src/pages/BuyerDashboard.tsx`
    - `src/pages/SupplierDashboard.tsx`
    - `src/lib/mock-db.ts`
- **Depends on:** none
- **Acceptance criteria:** A user can sign up as a supplier, list a tank, then sign up as a buyer and "order" that tank. The supplier can then see the order. Data persists on refresh.

### 2. quick_fix_engineer
- **Phases:** 5
- **Scope:** 
    - Polish the landing page for high visual impact.
    - Ensure all forms and tables are fully responsive.
    - Add `sonner` toasts for success/error messages.
    - Adjust CSS variables in `src/index.css` if needed for better "water" themed colors (blues/teals).
- **Files:** 
    - `src/index.css`
    - `src/pages/*`
- **Depends on:** frontend_engineer
- **Acceptance criteria:** App feels professional, looks great on mobile, and provides clear user feedback.

**Do not dispatch:**
- supabase_engineer (Out of scope).
