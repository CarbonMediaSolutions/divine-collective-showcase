

# Fix browser back-button behavior on Shop pages

## The bug
Right now the Shop page (`/categories`) uses internal React state to track which category is selected. Clicking a category card swaps the view but **doesn't change the URL** — it stays on `/categories`. So when you later go into a product and hit the browser's back button, it takes you all the way back to the category grid (skipping the product list view), because that view never got its own history entry.

## The fix
Drive the active category from the URL itself. When a user clicks a category card, actually navigate to `/categories/Flowers` (the route already exists in `App.tsx` — it's just never used). When they click "← All Categories", navigate back to `/categories`.

This way the browser history becomes:
```
/                 →  /categories  →  /categories/Accessories  →  /product/backwoods-honey-berry
```
And clicking back from the product correctly returns to `/categories/Accessories`, then back again returns to `/categories`, then back returns home — exactly what you'd expect.

## Changes to `src/pages/CategoriesPage.tsx`

1. **Remove the `activeCategory` `useState`.** Derive it directly from the `:category` URL param every render.
2. **`handleCategoryClick(catName)`** → `navigate(`/categories/${encodeURIComponent(catName)}`)` instead of `setActiveCategory(...)`.
3. **`handleBackToCategories()`** → `navigate('/categories')` instead of `setActiveCategory(null)`.
4. **Reset `page` to 1** via a `useEffect` that watches `urlCategory`, so pagination resets correctly when the category changes.
5. Keep the existing `ScrollToTop` behavior (already in `App.tsx`) so each navigation scrolls to top.

No other files need to change. The route `/categories/:category` is already wired up in `App.tsx`.

## What you'll notice after
- URL bar updates to `/categories/Flowers` when you pick a category (also makes categories shareable/bookmarkable — bonus)
- Browser back from a product page → returns to that category's product list
- Browser back again → returns to the category grid
- Browser back again → returns to the home page

