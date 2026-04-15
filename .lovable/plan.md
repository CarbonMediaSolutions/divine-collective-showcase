

# Generate Public Sitemap

## Overview
Create a static `sitemap.xml` file in the `public/` folder so search engines can discover all public pages. Since this is a single-page app with client-side routing, the sitemap will list all publicly accessible routes using the published domain.

## Changes

### 1. Create `public/sitemap.xml`
Static XML file listing all public routes:
- `/` (Home)
- `/categories` (Shop)
- `/strains` (Strains Library)
- `/lounge` (Lounge)
- `/contact` (Contact)
- `/my-membership` (Membership)
- `/member-signup` (Member Sign Up)
- `/cart` (Cart)

Excludes: `/admin`, `/checkout`, `/payment-success`, `/payment-cancelled`, individual product/strain detail pages (dynamic), `/membership-required`

### 2. Update `public/robots.txt`
Add a `Sitemap:` directive pointing to the sitemap URL so crawlers find it automatically.

## Files
| Action | File |
|--------|------|
| Create | `public/sitemap.xml` |
| Modify | `public/robots.txt` |

