

# Admin Dashboard Plan

## Overview
Add a password-gated admin section at `/admin` with three tabs: Products, Members, and Sales. Protected by a simple password prompt.

## Pages & Components

### 1. Admin Login Gate (`src/pages/AdminPage.tsx`)
- Simple password input screen (hardcoded password check, e.g. "divine2026" — stored in a constant, not localStorage)
- On correct password, show the admin dashboard
- Session stored in React state only (refreshing requires re-entry)

### 2. Admin Dashboard (inside `AdminPage.tsx`)
Three tabs using shadcn Tabs component:

**Products Tab**
- Table listing all ~450 products from `src/data/products.ts`
- Columns: SKU, Name, Category, Price, Sale Price, In Stock
- Search/filter by name or category
- Read-only for now (data is static)

**Members Tab**
- Fetches all rows from `public.members` table via Supabase
- Columns: Name, Email, Phone, ID Number, Status, Joined, Expiry
- Search by name/email
- Show active vs expired badge

**Sales Tab**
- Since orders aren't stored in DB yet, create an `orders` table to persist checkout data
- Migration: `orders` table with columns: id, customer_name, email, phone, items (jsonb), total, status, payment_ref, created_at
- Update `CheckoutPage` and `PaymentSuccessPage` to save order records
- Admin shows table of all orders with date, customer, total, status

### 3. Route
- Add `/admin` route in `App.tsx` (no header/footer wrapper — clean admin layout)

### Database Changes
- New `orders` table with public insert + admin-readable RLS (using public select for simplicity since admin is password-gated client-side)
- Save order on successful payment callback

### Files Created/Modified
- **Create**: `src/pages/AdminPage.tsx` (~300 lines)
- **Modify**: `src/App.tsx` (add route)
- **Modify**: `src/pages/PaymentSuccessPage.tsx` (save order to DB)
- **Modify**: `src/pages/CheckoutPage.tsx` (store pending order in localStorage for post-payment save)
- **Migration**: Create `orders` table

