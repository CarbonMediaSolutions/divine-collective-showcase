

# Membership System Upgrade Plan

## Key Answers First

### BobPay Subscriptions
BobPay's subscription/recurring payments feature is listed as **"Coming soon"** on their website. It is not yet available. This means:
- Memberships **cannot** be auto-renewed via BobPay right now
- The current flow (one-time R100 payment for 3 months) is the correct approach
- When membership expires, the member would need to manually re-purchase
- We can add expiry reminder emails later if needed

### Form Fields (Matching JoinIt)

From the screenshot, JoinIt collects:
1. First Name
2. Last Name
3. Date of Birth
4. Phone
5. ID Number
6. Upload ID Image (Front)
7. Upload ID Image (Back)
8. "Where did you hear about us?"
9. Terms & Conditions (checkbox)
10. Marketing Consent (checkbox)

The current form has some of these but is missing: last name (separate field), ID back upload, "where did you hear about us", T&C checkbox, marketing consent checkbox.

### Existing Members (~1,832 records)
The CSV contains member data that should be imported into a database table so the system can validate membership status server-side rather than relying on localStorage.

---

## Implementation Plan

### 1. Create `members` Database Table
Store membership data server-side instead of localStorage only.

```sql
CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  id_number text,
  birthday date,
  status text DEFAULT 'Pending',
  joined_date date DEFAULT CURRENT_DATE,
  expiration_date date,
  id_front_url text,
  id_back_url text,
  referral_source text,
  terms_accepted boolean DEFAULT false,
  marketing_consent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Public insert (for signup form)
CREATE POLICY "Anyone can insert members"
  ON public.members FOR INSERT
  WITH CHECK (true);

-- Public select by email (for membership lookup)
CREATE POLICY "Anyone can check membership by email"
  ON public.members FOR SELECT
  USING (true);
```

### 2. Create Storage Bucket for ID Uploads
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('id-documents', 'id-documents', false);
```
With RLS policy allowing anonymous uploads.

### 3. Update Membership Checkout Form
Modify `MembershipCheckoutPage.tsx` to match the JoinIt fields:
- Split "Full Name" into **First Name** and **Last Name**
- Keep ID Number + age verification logic
- Add **ID Back upload** (currently only one upload)
- Add **"Where did you hear about us?"** dropdown/text field
- Add **Terms & Conditions** checkbox (required)
- Add **Marketing Consent** checkbox (optional)
- On successful payment return, save member record to the database

### 4. Import Existing Members
Create an edge function or migration script to bulk-import the ~1,832 members from the CSV into the `members` table. Key field mapping:
- `email` → `email`
- `first_name` → `first_name`
- `last_name` → `last_name`
- `phone` → `phone`
- `birthday` → `birthday`
- `joined_date` → `joined_date`
- `expiration_date` → `expiration_date`
- `status` → `status`
- `ID Number` (custom field) → `id_number`
- `Upload Your ID Image (Front)` → `id_front_url`
- `Upload Your ID Image (Back)` → `id_back_url`

### 5. Update Membership Validation
Update `MembershipContext` to check membership status from the database (by email/phone) instead of only localStorage. This allows existing JoinIt members to be recognized.

### Technical Notes
- BobPay does NOT support recurring billing yet — membership remains a manual 3-month purchase
- The CSV has ~1,832 rows with mixed data quality (some rows missing email, phone, etc.)
- ID documents will be stored securely in a private storage bucket

