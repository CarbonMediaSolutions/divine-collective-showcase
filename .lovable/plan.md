

# Lock Down All Shopping While Shop Is Under Maintenance

## Overview
The shop page has password protection, but products are still accessible from other parts of the site — the homepage "Best Sellers" section, product detail pages, strain detail "Buy Now" buttons, and the cart/checkout routes. We need to lock all of these down.

## Changes

### 1. Homepage — Replace "Best Sellers" with "Coming Soon" (`src/pages/HomePage.tsx`)
- Replace the Best Sellers product grid (lines 109-121) with a "Coming Soon" message styled consistently with the site
- Remove the `bestSellers` useMemo and ProductCard import since they're no longer needed
- Also update the hero "SHOP OUR PRODUCTS" link to not navigate to the shop (or remove it)

### 2. Strain Detail — Remove "Buy Now" button (`src/pages/StrainDetailPage.tsx`)
- Remove or hide the "BUY NOW" button block (lines 151-158) that links to product pages
- Strains can still be browsed as an encyclopedia, just no purchasing

### 3. Product Detail Page — Block access (`src/pages/ProductPage.tsx`)
- Add the same session-based password check used on CategoriesPage
- If not authenticated, redirect to the shop page (which shows the login gate)

### 4. Cart & Checkout — Block access (`src/pages/CartPage.tsx`, `src/pages/CheckoutPage.tsx`)
- Add the same `sessionStorage.getItem("shopAccess")` check
- If not authenticated, redirect to the shop login gate

### 5. ProductCard — Remove "Add to Cart" button (`src/components/ProductCard.tsx`)
- Since ProductCard is only used in CategoriesPage (now gated) and HomePage (switching to Coming Soon), we can leave it as-is. But if it appears elsewhere, we'll conditionally hide the add-to-cart action.

## Files
| Action | File |
|--------|------|
| Modify | `src/pages/HomePage.tsx` |
| Modify | `src/pages/StrainDetailPage.tsx` |
| Modify | `src/pages/ProductPage.tsx` |
| Modify | `src/pages/CartPage.tsx` |
| Modify | `src/pages/CheckoutPage.tsx` |

