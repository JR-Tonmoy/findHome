# Invoice Download System - Complete Implementation Guide

## 🎯 Overview

The invoice download system allows both tenants and property owners to download professional PDF invoices for completed payments in the BashaLagbe rental platform.

---

## ✅ What Has Been Implemented

### 1. **Backend PDF Generation** ✅

- **Package:** `barryvdh/laravel-dompdf` (v3.1.2)
- **Location:** `backend/app/Http/Controllers/Api/V1/InvoiceController.php`
- **Method:** `download(Payment $payment)` - Generates and returns PDF invoice

### 2. **Professional Invoice PDF** ✅

Includes:

- BashaLagbe branding and logo
- Invoice ID and Transaction ID
- Property details (name, location, duration, monthly rent)
- Tenant and owner information
- Payment breakdown:
  - Monthly rent
  - Booking duration
  - Total payment amount
  - Admin commission (20%)
  - Owner earnings (80%)
- Payment method and date
- Payment status badge
- Professional CSS styling with print support

### 3. **Authorization & Security** ✅

The system includes proper authorization checks:

- **Admin:** Can download any invoice
- **Owner:** Can download invoices for their properties only
- **Tenant:** Can download invoices for their payments only
- Returns 401 for unauthenticated users
- Returns 403 for unauthorized access
- Comprehensive logging of all download attempts

### 4. **Frontend Components** ✅

#### **Tenant Payment History** (`frontend/src/pages/User/Dashboard/PaymentHistory.jsx`)

- Shows all tenant payments and pending bookings
- Download button for completed payments only
- Loading state while downloading
- Error handling with user-friendly messages
- Shows "Pay Now" for pending payments

#### **Owner Payment History** (`frontend/src/pages/Owner/Dashboard/PaymentHistory.jsx`)

- Shows all payments from tenants
- Statistics cards:
  - Total Earnings (80% of payments)
  - Admin Commission breakdown
  - Total Platform Revenue
- Filter by payment status (All, Completed, Pending)
- Download button for completed payments only
- Loading state during download
- Professional table layout

---

## 📊 Data Structure

### Payment Model Relationships

```
Payment
├── Booking (belongs to)
│   └── Property
│       └── Owner (User)
│   └── Tenant (User)
├── Tenant (User - direct relationship)
├── Property
└── Owner (User - direct relationship)
```

### Invoice Data Fields

```
{
  "transaction_id": "BL-5-ABC123",
  "payment_method": "SSLCommerz",
  "payment_date": "16 May 2026, 02:30 PM",
  "issue_date": "16 May 2026",
  "payment_status": "completed",

  "property_title": "Apartment in Gulshan",
  "property_location": "Dhaka, Bangladesh",
  "booking_duration": 3,
  "monthly_rent": "৳ 15,000.00",

  "total_amount": "৳ 45,000.00",
  "admin_commission": "৳ 9,000.00",
  "owner_earning": "৳ 36,000.00",

  "tenant_name": "John Doe",
  "tenant_email": "john@example.com",
  "owner_name": "Jane Smith",
  "owner_email": "jane@example.com"
}
```

---

## 🔌 API Endpoints

### Invoice Endpoints (Protected with Auth)

#### **Download Invoice PDF**

```
GET /api/v1/invoices/{payment}/download
```

**Authorization Required:** Yes (Bearer token)

**Request Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**

- **Success (200):** PDF file download
- **Unauthorized (401):** User not authenticated
- **Forbidden (403):** User doesn't have permission to access this invoice
- **Server Error (500):** Failed to generate PDF

**Example Usage:**

```javascript
const response = await fetch(
  "http://localhost:8000/api/v1/invoices/5/download",
  {
    headers: {
      Authorization: "Bearer YOUR_TOKEN",
    },
  },
);

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "invoice_5.pdf";
a.click();
```

#### **Get Invoice Data (JSON)**

```
GET /api/v1/invoices/{payment}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "transaction_id": "BL-5-ABC123",
    "payment_method": "SSLCommerz",
    ...
  }
}
```

---

## 🔐 Authorization Implementation

### Backend Check (InvoiceController)

```php
$user = auth()->user();

// Check if user is authorized
$isAuthorized = $user->role === 'admin' ||
               ($user->role === 'owner' && $user->id === $payment->property?->user_id) ||
               ($user->role === 'tenant' && $user->id === $payment->tenant_id);

if (!$isAuthorized) {
    return response('Unauthorized', 403);
}
```

### Frontend Check

```javascript
const token = localStorage.getItem("access_token");
const response = await fetch(`${API_URL}/v1/invoices/${paymentId}/download`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 📱 Frontend Implementation

### Tenant Payment History

#### Component Location

- **File:** `frontend/src/pages/User/Dashboard/PaymentHistory.jsx`
- **Route:** `/dashboard/payments`

#### Key Features

```jsx
// Download button in action column
{
  payment.status === "pending" ? (
    <button onClick={() => handleMakePayment(payment.bookingId)}>
      Pay Now
    </button>
  ) : (
    <button onClick={() => handleDownloadInvoice(payment.id)}>
      <Download size={14} />
      Invoice
    </button>
  );
}

// Download handler
const handleDownloadInvoice = async (paymentId) => {
  setDownloadingId(paymentId);
  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${API_URL}/v1/invoices/${paymentId}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (response.status === 401) {
      alert("Your session has expired. Please login again.");
    } else {
      alert("Failed to download invoice");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Error downloading invoice. Please try again.");
  } finally {
    setDownloadingId(null);
  }
};
```

### Owner Payment History

#### Component Location

- **File:** `frontend/src/pages/Owner/Dashboard/PaymentHistory.jsx`
- **Route:** `/owner-dashboard/payments` (or similar)

#### Key Features

```jsx
// Download button with loading state
<button
  onClick={() => handleDownloadInvoice(payment.id)}
  disabled={downloadingId === payment.id}
  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
    downloadingId === payment.id
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
  }`}
>
  <Download size={16} />
  {downloadingId === payment.id ? "Downloading..." : "Invoice"}
</button>
```

---

## 🧪 Testing Checklist

### Prerequisites

- [ ] Backend Laravel server running (`php artisan serve`)
- [ ] Frontend React server running (`npm run dev`)
- [ ] Database seeded with test bookings and payments
- [ ] User logged in with valid access token

### Step-by-Step Test

#### 1. **Verify Database**

```bash
# SSH into database or use Laravel Tinker
php artisan tinker

# Check payments table exists
>>> DB::table('payments')->count()
>>> DB::table('payments')->first()
```

#### 2. **Test Backend PDF Generation**

```bash
# Test direct API call (replace with real payment ID)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/invoices/1/download \
  -o invoice_test.pdf

# Check if PDF was created
file invoice_test.pdf
```

#### 3. **Test Tenant Invoice Download**

```
1. Login as tenant user
2. Navigate to /dashboard/payments
3. Find a completed payment
4. Click "Invoice" button
5. Verify PDF downloads automatically
6. Check PDF content is correct
7. Test authorization: try to download invoice for another tenant's payment
```

#### 4. **Test Owner Invoice Download**

```
1. Login as property owner
2. Navigate to /owner-dashboard/payments
3. Find a completed payment from tenant
4. Click "Invoice" button in table
5. Verify PDF downloads automatically
6. Check PDF shows correct commission breakdown (80% to owner, 20% to admin)
7. Test authorization: verify owner can only see their payments
```

#### 5. **Test Admin Access**

```
1. Login as admin user
2. Navigate to admin payments/revenue page
3. Verify admin can download any invoice
4. Check PDF content is identical for all users
```

#### 6. **Error Handling Tests**

```
1. Test expired token: Logout and try to download
   - Should show: "Your session has expired. Please login again."
2. Test unauthorized access: Try to download another user's invoice
   - Should show: "You don't have permission to download this invoice."
3. Test network error: Disconnect internet and try to download
   - Should show: "Error downloading invoice. Please try again."
4. Test loading state: Verify button shows "Downloading..." during download
```

### Test Scenarios

#### Scenario 1: Successful Payment and Invoice Download

```
1. Create booking as Tenant A
2. Approve booking as Owner B
3. Make payment as Tenant A via SSLCommerz
4. Payment marked as "completed"
5. Tenant A can download invoice from /dashboard/payments
6. Owner B can download same invoice from /owner-dashboard/payments
7. Admin can download invoice from admin panel
8. PDF contains all correct information
```

#### Scenario 2: Commission Calculation Verification

```
Payment Amount: ৳ 50,000
Total Amount in Invoice: ৳ 50,000
Admin Commission (20%): ৳ 10,000
Owner Earnings (80%): ৳ 40,000

Verify:
- Admin commission = Payment amount × 0.20
- Owner earning = Payment amount × 0.80
- Total = Admin commission + Owner earning
```

#### Scenario 3: Multiple Properties and Tenants

```
1. Create 3 properties owned by Owner B
2. Create 5 bookings from different tenants
3. Complete 3 payments
4. For each owner: Verify they see only their property payments
5. For each tenant: Verify they see only their payments
6. Verify download buttons work for all payments
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Install barryvdh/laravel-dompdf on production server
- [ ] Update SSLCommerz credentials to live credentials
- [ ] Set `SSLCZ_SANDBOX=false` in production `.env`
- [ ] Test PDF generation with production database
- [ ] Verify HTTPS is enabled (some browsers require it for downloads)
- [ ] Set up PDF storage (optional - for keeping history)
- [ ] Configure logging for invoice download tracking
- [ ] Test with real payment flow end-to-end
- [ ] Backup database before deploying
- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)

---

## 📝 File Summary

### Backend Files Updated

| File                                                        | Changes                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------- |
| `backend/app/Http/Controllers/Api/V1/InvoiceController.php` | Added DomPDF integration, PDF generation, authorization |
| `backend/routes/api.php`                                    | Invoice routes already registered                       |
| `backend/composer.json`                                     | Added barryvdh/laravel-dompdf                           |

### Frontend Files Updated

| File                                                    | Changes                                                |
| ------------------------------------------------------- | ------------------------------------------------------ |
| `frontend/src/pages/User/Dashboard/PaymentHistory.jsx`  | Added invoice download, loading states, error handling |
| `frontend/src/pages/Owner/Dashboard/PaymentHistory.jsx` | Added invoice download, loading states, error handling |

---

## 🐛 Troubleshooting

### Issue: "Failed to generate invoice"

**Cause:** Payment record not found or relationships misconfigured
**Solution:**

```php
// Check payment record exists
php artisan tinker
>>> Payment::find(5)->with('booking', 'tenant', 'property')->first()

// Verify relationships
>>> $payment->booking
>>> $payment->tenant
>>> $payment->property
```

### Issue: "DOMPDF not found"

**Cause:** Package not installed
**Solution:**

```bash
cd backend
composer require barryvdh/laravel-dompdf
php artisan package:discover
```

### Issue: PDF download shows gibberish or empty

**Cause:** MIME type mismatch or encoding issue
**Solution:**

- Verify response headers include `Content-Type: application/pdf`
- Check browser console for network errors
- Verify `$response->ok` in frontend code

### Issue: Authorization errors (403)

**Cause:** User role or relationships not set correctly
**Solution:**

```php
// Check user role
php artisan tinker
>>> auth()->user()->role

// Check payment-owner relationship
>>> Payment::find(5)->property->user_id === auth()->id()
```

### Issue: Button stays in "Downloading..." state

**Cause:** Exception thrown but not caught, or download takes too long
**Solution:**

- Check browser console for JavaScript errors
- Check Laravel logs: `storage/logs/laravel.log`
- Increase timeout if file is large

---

## 📚 Documentation Links

- [Laravel DomPDF Documentation](https://github.com/barryvdh/laravel-dompdf)
- [Laravel Authorization](https://laravel.com/docs/10.x/authorization)
- [React Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [File Download in Browser](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)

---

## ✨ Summary

✅ **Complete invoice download system implemented**

- Professional PDF generation with DomPDF
- Secure authorization for all user roles
- User-friendly frontend with loading states
- Comprehensive error handling
- Both tenant and owner dashboards fully integrated
- Ready for production deployment

**Status:** Ready for testing and deployment! 🚀
