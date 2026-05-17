# Invoice Download API - Quick Reference

## 🔗 Endpoints

### Download Invoice PDF

```
GET /api/v1/invoices/{payment_id}/download
```

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/pdf
```

**Response:** PDF file (automatic download)

**Status Codes:**

- `200` - Success, PDF returned
- `401` - Not authenticated
- `403` - Not authorized to access this invoice
- `404` - Payment not found
- `500` - Server error

---

### Get Invoice Data (JSON)

```
GET /api/v1/invoices/{payment_id}
```

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

**Response Body:**

```json
{
  "success": true,
  "data": {
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
}
```

---

## 🧪 Example Usage

### JavaScript (Fetch API)

```javascript
const paymentId = 5;
const token = localStorage.getItem("access_token");
const apiUrl = "http://localhost:8000/api";

// Method 1: Download PDF
async function downloadInvoice() {
  try {
    const response = await fetch(
      `${apiUrl}/v1/invoices/${paymentId}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${paymentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
}

// Method 2: Get Invoice JSON
async function getInvoiceData() {
  try {
    const response = await fetch(`${apiUrl}/v1/invoices/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (data.success) {
      console.log("Invoice Data:", data.data);
      return data.data;
    }
  } catch (error) {
    console.error("Failed to fetch invoice data:", error);
  }
}
```

### cURL Examples

```bash
# Download PDF
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/invoices/5/download \
  -o invoice_5.pdf

# Get Invoice JSON
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/invoices/5 \
  -H "Accept: application/json"
```

### Python Requests

```python
import requests

token = 'YOUR_ACCESS_TOKEN'
payment_id = 5
api_url = 'http://localhost:8000/api'

# Download PDF
headers = {'Authorization': f'Bearer {token}'}
response = requests.get(
    f'{api_url}/v1/invoices/{payment_id}/download',
    headers=headers
)

if response.status_code == 200:
    with open(f'invoice_{payment_id}.pdf', 'wb') as f:
        f.write(response.content)
```

---

## 📋 Authorization Rules

| User Role  | Can Access                         |
| ---------- | ---------------------------------- |
| **Admin**  | All invoices                       |
| **Owner**  | Invoices for their properties only |
| **Tenant** | Invoices for their payments only   |
| **Guest**  | None (401 Unauthorized)            |

---

## ⚠️ Error Responses

### Unauthorized (401)

```json
{
  "message": "Unauthorized"
}
```

**Cause:** No token or invalid token

### Forbidden (403)

```json
{
  "message": "Unauthorized"
}
```

**Cause:** Token valid but user doesn't have permission

### Not Found (404)

```json
{
  "message": "Payment not found"
}
```

**Cause:** Payment ID doesn't exist

### Server Error (500)

```
Failed to generate invoice: [error message]
```

**Cause:** PDF generation error

---

## 🔍 Testing

### Test in Insomnia/Postman

1. **Get Token**

   ```
   POST /api/v1/auth/login
   Body: { "email": "user@example.com", "password": "password" }
   Copy token from response
   ```

2. **Download Invoice**
   ```
   Method: GET
   URL: {{BASE_URL}}/api/v1/invoices/5/download
   Headers: Authorization: Bearer {{TOKEN}}
   Send → Save response as file
   ```

---

## 🛠️ Debugging

### Check if Payment Exists

```bash
curl http://localhost:8000/api/v1/payments/5 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check User Permissions

```bash
# As owner - should see invoice for their property
curl http://localhost:8000/api/v1/invoices/5 \
  -H "Authorization: Bearer OWNER_TOKEN"

# As different user - should get 403
curl http://localhost:8000/api/v1/invoices/5 \
  -H "Authorization: Bearer OTHER_USER_TOKEN"
```

### View PDF in Browser

```
http://localhost:8000/api/v1/invoices/5/download?token=YOUR_TOKEN
```

(Add `?inline=1` to view in browser instead of download)

---

## 📊 Common Queries

### Find All Payments for a User

```bash
curl http://localhost:8000/api/v1/payments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Find Specific Payment by Transaction ID

```bash
curl "http://localhost:8000/api/v1/payments?transaction_id=BL-5-ABC123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔐 Security Notes

1. **Always use HTTPS in production** - Payment data is sensitive
2. **Validate tokens server-side** - Don't rely on client-side checks
3. **Log all invoice downloads** - For audit trail
4. **Validate user relationships** - Verify owner owns property, tenant made payment
5. **Rate limit PDF generation** - Prevent abuse
6. **Store payment IDs securely** - Don't expose sensitive IDs in URLs

---

## 📞 Support

**Common Issues:**

| Issue                    | Solution                                    |
| ------------------------ | ------------------------------------------- |
| 401 Unauthorized         | Check token is valid and not expired        |
| 403 Forbidden            | Verify user has permission for this payment |
| Empty PDF                | Check payment data is complete in database  |
| Download button disabled | Wait for previous download to complete      |
| MIME type error          | Browser cache issue - clear cache and retry |

---

**Last Updated:** May 16, 2026
**Status:** Production Ready ✅
