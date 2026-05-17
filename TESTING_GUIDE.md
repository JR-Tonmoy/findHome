# 🧪 Invoice Download System - Step-by-Step Testing Guide

## Prerequisites

Before testing, ensure:

- [ ] Backend Laravel server running: `php artisan serve` (http://localhost:8000)
- [ ] Frontend React server running: `npm run dev` (http://localhost:5173)
- [ ] You have test user accounts (tenant, owner, admin)
- [ ] Database has at least one completed payment
- [ ] Browser developer tools available (F12)

---

## Quick Database Check

Before testing, verify you have a payment to download:

### Option 1: Laravel Tinker

```bash
cd backend
php artisan tinker

# Check payments exist
>>> Payment::where('payment_status', 'completed')->count()
# Should return number > 0

# View a payment
>>> $payment = Payment::where('payment_status', 'completed')->first()
>>> $payment->transaction_id
>>> $payment->tenant->name
>>> $payment->property->user->name
```

### Option 2: Direct Database Query

```sql
SELECT p.id, p.transaction_id, p.payment_status, p.total_amount
FROM payments p
WHERE p.payment_status = 'completed'
LIMIT 5;
```

---

## Testing Workflow

### Phase 1: Tenant Invoice Download (Beginner)

#### Test 1.1: Simple Download

```
Goal: Verify tenant can download their completed payment invoice

Steps:
1. Open browser: http://localhost:5173
2. Login as TENANT user
   - Email: tenant@example.com
   - Password: password123
3. Navigate to Dashboard
4. Click on "Payment History"
5. Look for payment with Status: "✓ Paid"
6. Click [Invoice] button
7. Verify PDF downloads to Downloads folder
8. Open PDF and check:
   - Transaction ID matches payment record
   - Property name is correct
   - Tenant name (Your name) appears as "Bill To"
   - Total amount matches expected value

Expected Result: ✓ PDF downloaded successfully
Actual Result: [Test this]
```

#### Test 1.2: Error Message - Session Expired

```
Goal: Verify session expiration is handled gracefully

Steps:
1. Login as tenant
2. Go to Payment History
3. Find a completed payment
4. Logout (open new tab and logout)
5. Click [Invoice] button (in original tab)
6. Verify error message appears

Expected Error Message:
"Your session has expired. Please login again."

Actual Result: [Test this]
```

#### Test 1.3: Loading State

```
Goal: Verify download button shows loading state

Steps:
1. Login as tenant
2. Go to Payment History
3. Find a completed payment
4. Click [Invoice] button
5. Before PDF completes, observe button text

Expected: Button should show "Downloading..."
Actual Result: [Test this]
```

---

### Phase 2: Owner Invoice Download (Intermediate)

#### Test 2.1: Owner Downloads Their Property Invoice

```
Goal: Verify owner can download invoices for their property

Steps:
1. Open browser: http://localhost:5173
2. Login as OWNER user
   - Email: owner@example.com
   - Password: password123
3. Navigate to Dashboard
4. Look for "Payment History" or "Revenue" section
5. Find a completed payment from a tenant
6. Click [Invoice] button
7. Verify PDF downloads
8. Open PDF and verify:
   - Property name (one of owner's properties)
   - Tenant name appears as "Bill To"
   - Owner name appears as "Bill From"
   - Commission breakdown shows:
     * Owner Earnings (80%): ৳ [amount]
     * Admin Commission (20%): ৳ [amount]

Expected Result: ✓ PDF shows correct commission split
Actual Result: [Test this]
```

#### Test 2.2: Commission Verification

```
Goal: Verify commission calculations are correct

Setup: Payment amount = ৳ 50,000

Calculation Check:
Total Amount: 50,000
Admin Commission (20%): 50,000 × 0.20 = 10,000
Owner Earnings (80%): 50,000 × 0.80 = 40,000
Sum: 10,000 + 40,000 = 50,000 ✓

PDF Should Show:
Total Payment: ৳ 50,000.00
Admin Commission (20%): ৳ 10,000.00
Owner Earnings (80%): ৳ 40,000.00

Verification:
- [ ] Total matches payment amount
- [ ] Admin commission = 20% of total
- [ ] Owner earnings = 80% of total
- [ ] Commission + Earnings = Total

Test Result: [Pass/Fail]
```

---

### Phase 3: Authorization Testing (Advanced)

#### Test 3.1: Unauthorized Access - Different Tenant

```
Goal: Verify tenant cannot download another tenant's invoice

Setup:
- Payment A: Made by Tenant 1
- Payment B: Made by Tenant 2

Steps:
1. Login as Tenant 1
2. Try to download Payment B invoice using direct API call:
```

curl -H "Authorization: Bearer TENANT1_TOKEN" \
 http://localhost:8000/api/v1/invoices/PAYMENT_B_ID/download \
 -o invoice.pdf

```
3. Observe response

Expected Response: 403 Forbidden
Frontend Alert: "You don't have permission to download this invoice."

Actual Result: [Test this]
```

#### Test 3.2: Unauthorized Access - Owner Wrong Property

```
Goal: Verify owner cannot download invoice for another owner's property

Setup:
- Property A: Owned by Owner 1
- Property B: Owned by Owner 2
- Payment: For Property B

Steps:
1. Login as Owner 1
2. Try to download Payment invoice
3. Should not appear in their payment history

Expected: Invoice doesn't show up in Owner 1's list
Actual Result: [Test this]
```

#### Test 3.3: Admin Can Download Any Invoice

```
Goal: Verify admin can download any invoice

Steps:
1. Login as ADMIN user
2. Navigate to Admin Dashboard
3. Go to Revenue/Analytics section
4. Find any payment
5. Click to download invoice
6. Verify PDF downloads successfully

Expected: Admin can download any payment's invoice
Actual Result: [Test this]
```

---

### Phase 4: Error Handling (Testing)

#### Test 4.1: Invalid Payment ID

````
Goal: Verify system handles invalid payment IDs

Steps:
1. Open browser console (F12)
2. Execute in console:
   ```javascript
   const token = localStorage.getItem('access_token');
   fetch('http://localhost:8000/api/v1/invoices/99999/download', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
   .then(r => console.log('Status:', r.status))
   .catch(e => console.error('Error:', e))
````

3. Observe status code

Expected: 404 (Not Found) or similar error
Actual Result: [Test this]

```

#### Test 4.2: Network Error Simulation
```

Goal: Verify error handling for network issues

Steps:

1. Login and go to Payment History
2. Open DevTools Network tab (F12 → Network)
3. Set Network throttling to "Offline"
4. Click [Invoice] button
5. Observe error message

Expected Error:
"Error downloading invoice. Please try again."

Actual Result: [Test this]

```

#### Test 4.3: Missing PDF File
```

Goal: Verify error handling if PDF generation fails

Manual Test (Django/PHP test):

1. Temporarily corrupt payment data:
   - Set payment.property_id = NULL
   - Try to download
2. Should show: "Failed to generate invoice: [error details]"
3. Restore payment data

Actual Result: [Test this]

```

---

### Phase 5: UI/UX Testing (Polish)

#### Test 5.1: Button States
```

Goal: Verify button shows correct states

Button States to Test:

1. [ ] Normal state: "Invoice" (blue text, clickable)
2. [ ] Hover state: "Invoice" (darker blue)
3. [ ] Loading state: "Downloading..." (grayed out, not clickable)
4. [ ] Pending payment: [should show "Pay Now" not "Invoice"]
5. [ ] After download: Back to normal state

Issues Found:

- [ ]
- [ ]

```

#### Test 5.2: PDF Content Quality
```

Goal: Verify PDF formatting and content

Check in Downloaded PDF:

1. [ ] Logo/Branding visible
2. [ ] Text is readable (not blurry)
3. [ ] All fields have data (no blank spaces)
4. [ ] Numbers formatted correctly (৳ symbol, comma separators)
5. [ ] Table formatting is clean
6. [ ] Colors are appropriate for printing
7. [ ] Print layout is correct (no cutoff text)

Issues Found:

- [ ]
- [ ]

```

#### Test 5.3: Cross-Browser Testing
```

Goal: Verify downloads work across browsers

Browser Tests:

- [ ] Chrome: Works correctly
- [ ] Firefox: Works correctly
- [ ] Safari: Works correctly
- [ ] Edge: Works correctly

Issues per browser:

- Chrome:
- Firefox:
- Safari:
- Edge:

```

---

### Phase 6: Performance Testing

#### Test 6.1: Download Speed
```

Goal: Verify PDF download is reasonably fast

Procedure:

1. Open DevTools Network tab
2. Click [Invoice] button
3. Observe "Time" column for invoice download

Acceptable Speed: < 2 seconds

Measurement:

- Payment 1: \_\_\_ ms
- Payment 2: \_\_\_ ms
- Payment 3: \_\_\_ ms
- Average: \_\_\_ ms

Result: [Pass/Fail]

```

#### Test 6.2: Multiple Downloads
```

Goal: Verify system handles multiple downloads

Procedure:

1. Download 5 invoices in quick succession
2. Verify all 5 PDFs downloaded correctly
3. Check for any errors

Result: [Pass/Fail]

````

---

## Checklist for Sign-Off

### Backend
- [ ] PHP syntax no errors
- [ ] DomPDF installed and configured
- [ ] Authorization checks working
- [ ] PDF generation produces valid files
- [ ] Error logging working
- [ ] All API endpoints responding correctly

### Frontend
- [ ] Download button appears for completed payments
- [ ] Loading state shows "Downloading..."
- [ ] PDF downloads to browser's downloads folder
- [ ] Error messages display correctly
- [ ] Works on mobile devices
- [ ] No console errors

### Security
- [ ] Unauthorized users cannot download invoices
- [ ] Session expiration handled gracefully
- [ ] User roles properly enforced
- [ ] No sensitive data in logs (besides transaction IDs)

### Documentation
- [ ] INVOICE_DOWNLOAD_SYSTEM_GUIDE.md complete
- [ ] INVOICE_API_QUICK_REFERENCE.md complete
- [ ] IMPLEMENTATION_COMPLETE.md complete
- [ ] All code commented

### Testing
- [ ] Tenant download: ✓
- [ ] Owner download: ✓
- [ ] Admin download: ✓
- [ ] Authorization failures: ✓
- [ ] Error handling: ✓
- [ ] Cross-browser: ✓
- [ ] Mobile: ✓

---

## Troubleshooting During Testing

### "PDF doesn't download"
1. Check browser console (F12) for errors
2. Check Laravel logs: `storage/logs/laravel.log`
3. Verify payment ID is valid
4. Verify user has permission

### "Button stuck on 'Downloading...'"
1. Check browser console for JavaScript errors
2. Hard refresh page (Ctrl+Shift+R)
3. Try different payment
4. Check server response in Network tab

### "Wrong data in PDF"
1. Verify payment data in database
2. Check that relationships are loaded correctly:
   ```php
   $payment->load('booking', 'tenant', 'property', 'owner');
````

3. Review formatInvoiceData() method

### "Authorization error despite being logged in"

1. Copy access token from localStorage
2. Test token validity:
   ```bash
   curl -H "Authorization: Bearer TOKEN" \
     http://localhost:8000/api/v1/payments
   ```
3. Verify user role in database
4. Check token hasn't expired

---

## Test Report Template

```
Invoice Download System - Test Report
Date: [Today]
Tester: [Your Name]

OVERALL RESULT: [ ] PASS  [ ] FAIL

Tenant Download: [ ] PASS  [ ] FAIL  Issues: ___
Owner Download: [ ] PASS  [ ] FAIL  Issues: ___
Admin Access: [ ] PASS  [ ] FAIL  Issues: ___
Authorization: [ ] PASS  [ ] FAIL  Issues: ___
Error Handling: [ ] PASS  [ ] FAIL  Issues: ___
Performance: [ ] PASS  [ ] FAIL  Issues: ___
UI/UX: [ ] PASS  [ ] FAIL  Issues: ___

Critical Issues Found:
1.
2.
3.

Recommendation: [ ] Ready for Production  [ ] Needs Fixes

Sign-off: ________________ Date: ________
```

---

## Quick Test (5 minutes)

For quick verification:

```
1. Start backend: php artisan serve
2. Start frontend: npm run dev
3. Login as tenant
4. Go to Payment History
5. Click Invoice button
6. Verify PDF downloads
✓ Done!
```

---

**Happy Testing! 🚀**
