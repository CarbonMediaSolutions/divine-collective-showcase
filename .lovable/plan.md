

# Add Visibility Toggle to Strains

## Overview
Add a `visible` column to the strains table so the admin can hide/show strains. All strains will be hidden by default, and the public Strains Library page will only show visible ones. The admin gets a quick toggle in the table plus filter controls.

## Changes

### 1. Database migration
- Add `visible boolean DEFAULT false` column to `strains` table
- This sets all existing ~150 strains to hidden by default

### 2. Admin Strains Tab (`src/components/admin/StrainsTab.tsx`)
- Add a "Visible" column to the table with a clickable toggle (Switch) that updates the DB inline — no need to open the edit dialog
- Add a "Visible" toggle in the edit dialog form alongside "In Stock" and "Featured"
- Add filter buttons above the table: "All", "Visible", "Hidden" so the admin can quickly find which strains are shown/hidden
- The search already exists — no changes needed there

### 3. Public Strains Page (`src/pages/StrainsPage.tsx`)
- Add `.eq("visible", true)` to the query so only visible strains appear on the public-facing page

### 4. Strain Detail Page (`src/pages/StrainDetailPage.tsx`)
- Add `.eq("visible", true)` to the detail query so hidden strains can't be accessed by URL

## Files
| Action | File |
|--------|------|
| Migration | Add `visible` column to `strains` (default `false`) |
| Modify | `src/components/admin/StrainsTab.tsx` |
| Modify | `src/pages/StrainsPage.tsx` |
| Modify | `src/pages/StrainDetailPage.tsx` |

