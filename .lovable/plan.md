

# Fix BobPay 401 Authentication Error

## Problem
The edge function is getting a **401 "Authentication failed"** from BobPay. The logs confirm the API key is being sent, but the request URL is wrong.

## Root Cause
The edge function calls `https://api.sandbox.bobpay.co.za/payments/intents/link`, but according to the BobPay API docs, the correct sandbox base URL is **`https://api.sandbox.bobpay.co.za/v2/`**. The payment links endpoint should be `https://api.sandbox.bobpay.co.za/v2/payment-links`.

## Fix

### Update Edge Function (`supabase/functions/create-bobpay-payment/index.ts`)
- Change the API URL from `https://api.sandbox.bobpay.co.za/payments/intents/link` to `https://api.sandbox.bobpay.co.za/v2/payment-links`
- Keep everything else the same (Bearer auth, request body, CORS)

This is a one-line URL change in the edge function.

