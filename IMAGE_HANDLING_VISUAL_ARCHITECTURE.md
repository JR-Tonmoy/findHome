# Image Handling System - Visual Architecture

## 1. COMPLETE IMAGE UPLOAD FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROPERTY IMAGE UPLOAD FLOW                   │
└─────────────────────────────────────────────────────────────────┘

1. USER INTERACTION
   ┌─────────────────────────────────────────────────┐
   │ Owner opens AddProperty.jsx                     │
   │ Clicks file input / Drag-drop area              │
   │ Selects multiple image files                    │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
2. FRONTEND PROCESSING
   ┌─────────────────────────────────────────────────┐
   │ handleImageUpload(event) called                 │
   │ ├─ const files = Array.from(event.target.files) │
   │ ├─ Create blob URLs via URL.createObjectURL()   │
   │ ├─ setUploadedImages([...old, ...new])          │
   │ └─ setUploadedImageFiles([...old, ...new])      │
   │                                                  │
   │ Result: Images shown in grid preview            │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
3. PREVIEW DISPLAY
   ┌─────────────────────────────────────────────────┐
   │ Grid of uploaded image previews                 │
   │ Each with "Remove" button                       │
   │ User can review before submitting               │
   │                                                  │
   │ Example:                                         │
   │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
   │ │ Pic1 │ │ Pic2 │ │ Pic3 │ │ Pic4 │            │
   │ │[X]   │ │[X]   │ │[X]   │ │[X]   │            │
   │ └──────┘ └──────┘ └──────┘ └──────┘            │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
4. USER SUBMITS FORM
   ┌─────────────────────────────────────────────────┐
   │ handleSubmit(event) called                      │
   │ ├─ Validate required fields                     │
   │ ├─ Collect form data                            │
   │ └─ Call saveProperty()                          │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
5. PREPARE MULTIPART FORMDATA
   ┌─────────────────────────────────────────────────┐
   │ buildPropertyRequestBody(property)              │
   │                                                  │
   │ formData = new FormData()                       │
   │ formData.append('title', ...)                   │
   │ formData.append('category', ...)                │
   │ formData.append('price', ...)                   │
   │ ... [all property fields]                       │
   │                                                  │
   │ uploadedImageFiles.forEach(file => {           │
   │   formData.append('images[]', file)             │
   │ })                                               │
   │                                                  │
   │ Result: FormData with all property data        │
   │ and image File objects                          │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
6. HTTP REQUEST (FRONTEND)
   ┌─────────────────────────────────────────────────┐
   │ http.post('/api/v1/properties', formData)       │
   │                                                  │
   │ Headers:                                         │
   │ ├─ Authorization: Bearer {token}                │
   │ ├─ (Content-Type: removed for multipart)        │
   │ └─ Browser sets multipart boundary              │
   │                                                  │
   │ Body: Multipart FormData                        │
   │ ├─ Property fields as form data                 │
   │ └─ Image files as binary data                   │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼ (Network Request)
7. BACKEND RECEIVES
   ┌─────────────────────────────────────────────────┐
   │ PropertyController::store(Request $request)     │
   │ ├─ Parse multipart form data                    │
   │ ├─ Authenticate user (owner role)               │
   │ └─ Validate all fields                          │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
8. STORE IMAGE FILES
   ┌─────────────────────────────────────────────────┐
   │ storePropertyImages($request, [])               │
   │                                                  │
   │ foreach ($request->file('images') as $file) {   │
   │   // Validate                                    │
   │   $file->isValid();  // jpg, png, max 5MB       │
   │                                                  │
   │   // Store in public storage                     │
   │   $path = $file->store(                         │
   │     'property-images',  // directory             │
   │     'public'             // disk                 │
   │   );                                             │
   │                                                  │
   │   // Add to array                                │
   │   $storedImages[] = $path;                      │
   │ }                                                │
   │                                                  │
   │ Result: [                                        │
   │   'property-images/abc123.jpg',                 │
   │   'property-images/def456.jpg'                  │
   │ ]                                                │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
9. SAVE TO DATABASE
   ┌─────────────────────────────────────────────────┐
   │ Property::create([                              │
   │   'title' => '2BR Apartment',                   │
   │   'price' => '15000',                           │
   │   ... [other fields]                            │
   │   'images' => $storedImages,  // JSON array      │
   │   'image' => $storedImages[0] // Main thumbnail │
   │ ])                                               │
   │                                                  │
   │ Database:                                        │
   │ id    │ title      │ images                     │ image         │
   │ ──────┼────────────┼─────────────────────────┼─────────────────│
   │ 1     │ 2BR Apt    │ ["prop-img/abc.jpg",    │ "prop-img/abc. │
   │ │    │            │ "prop-img/def.jpg"]     │ jpg"           │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
10. RESOLVE IMAGE URLS
    ┌─────────────────────────────────────────────────┐
    │ mapPropertyWithOwner($property)                 │
    │                                                  │
    │ foreach ($images as $image) {                   │
    │   $url = resolvePropertyMediaUrl($image);       │
    │                                                  │
    │   Input:  'property-images/abc123.jpg'         │
    │   Output: 'https://api.../storage/...jpg'      │
    │ }                                                │
    │                                                  │
    │ Add owner information:                          │
    │ - Owner name, phone, email, avatar             │
    └──────────────┬──────────────────────────────────┘
                  │
                  ▼
11. API RESPONSE
    ┌─────────────────────────────────────────────────┐
    │ Response JSON:                                   │
    │ {                                                │
    │   "success": true,                              │
    │   "data": {                                      │
    │     "id": 1,                                     │
    │     "title": "2BR Apartment",                   │
    │     "images": [                                  │
    │       "https://api.../storage/prop-img/abc.jpg",│
    │       "https://api.../storage/prop-img/def.jpg" │
    │     ],                                           │
    │     "image": "https://api.../storage/...",      │
    │     "owner": {                                   │
    │       "name": "John Doe",                        │
    │       "avatar": "https://api.../storage/..."    │
    │     }                                            │
    │     ... [other fields]                          │
    │   }                                              │
    │ }                                                │
    └──────────────┬──────────────────────────────────┘
                  │
                  ▼
12. FRONTEND RESPONSE HANDLING
    ┌─────────────────────────────────────────────────┐
    │ saveProperty() receives response                │
    │ ├─ normalizePropertyRecord()                    │
    │ ├─ Resolve relative paths to URLs               │
    │ ├─ Save to localStorage                         │
    │ └─ Return normalized property                   │
    │                                                  │
    │ Result: Property with full URLs ready to use   │
    └──────────────┬──────────────────────────────────┘
                  │
                  ▼
13. REDIRECT & SUCCESS
    ┌─────────────────────────────────────────────────┐
    │ Show success message                            │
    │ Redirect to owner dashboard                     │
    │ Owner sees new property with images             │
    │ Images fully resolved and displaying            │
    └─────────────────────────────────────────────────┘

```

---

## 2. IMAGE DISPLAY FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│               IMAGE RETRIEVAL & DISPLAY FLOW                    │
└─────────────────────────────────────────────────────────────────┘

1. LOAD PROPERTIES FROM BACKEND
   ┌─────────────────────────────────────────────────┐
   │ GET /api/v1/properties                          │
   │ Response includes image paths (storage-relative)│
   │                                                  │
   │ [                                                │
   │   {                                              │
   │     "id": 1,                                     │
   │     "images": ["property-images/pic1.jpg", ...] │
   │     "image": "property-images/pic1.jpg"         │
   │   },                                             │
   │   ...                                            │
   │ ]                                                │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
2. NORMALIZE PROPERTY RECORD
   ┌─────────────────────────────────────────────────┐
   │ normalizePropertyRecord(property)               │
   │                                                  │
   │ For each image:                                  │
   │   Input:  "property-images/pic1.jpg"           │
   │   ├─ Detect format (relative path)             │
   │   ├─ Prepend API base URL                       │
   │   └─ Output: "https://api.../storage/..."      │
   │                                                  │
   │ Result: Property with full resolved URLs        │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
3. STORE NORMALIZED DATA
   ┌─────────────────────────────────────────────────┐
   │ Save to localStorage or React state             │
   │ Ready for display in components                 │
   │                                                  │
   │ property = {                                     │
   │   id: 1,                                         │
   │   images: [                                      │
   │     "https://api.../storage/property-images/...",
   │     "https://api.../storage/property-images/..." │
   │   ],                                             │
   │   image: "https://api.../storage/..."           │
   │ }                                                │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
4. RENDER COMPONENT
   ┌─────────────────────────────────────────────────┐
   │ <img                                             │
   │   src={property.image ||                        │
   │        property.images?.[0] ||                  │
   │        "fallback.jpg"}                          │
   │   alt={property.title}                          │
   │ />                                               │
   │                                                  │
   │ src = "https://api.../storage/property-images..." │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
5. BROWSER REQUESTS IMAGE
   ┌─────────────────────────────────────────────────┐
   │ GET https://api.../storage/property-images/pic.jpg
   │                                                  │
   │ Browser HTTP request with:                       │
   │ ├─ No auth needed (public storage)              │
   │ └─ Standard image request headers               │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼ (Network Request)
6. LARAVEL SERVES FILE
   ┌─────────────────────────────────────────────────┐
   │ Request hits /storage/ route                    │
   │ Maps to: storage/app/public/property-images/    │
   │ Returns: Binary image data                      │
   │                                                  │
   │ Headers:                                         │
   │ ├─ Content-Type: image/jpeg                     │
   │ ├─ Content-Length: 12345                        │
   │ └─ Cache-Control: public, max-age=86400        │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
7. BROWSER RENDERS
   ┌─────────────────────────────────────────────────┐
   │ <img> tag displays image in DOM                 │
   │ Applies CSS styling:                            │
   │ ├─ object-cover for consistent sizing           │
   │ ├─ Rounded corners                              │
   │ ├─ Border styling                               │
   │ └─ Hover animations                             │
   │                                                  │
   │ Result: Beautiful image displayed to user       │
   └─────────────────────────────────────────────────┘

```

---

## 3. PROFILE IMAGE UPLOAD FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              PROFILE IMAGE UPLOAD FLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. USER SELECTS AVATAR
   ┌─────────────────────────────────────────────────┐
   │ Member/Admin clicks avatar circle               │
   │ Hover shows camera icon                         │
   │ Hidden file input: accept="image/*"             │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
2. FILE SELECTED
   ┌─────────────────────────────────────────────────┐
   │ handlePhotoUpload(event)                        │
   │ ├─ const file = event.target.files[0]           │
   │ ├─ Create FileReader                            │
   │ ├─ readAsDataURL(file)                          │
   │ └─ On load: setPhotoPreview(dataURL)            │
   │                                                  │
   │ Result: Image shows in avatar immediately       │
   │ photoPreview = "data:image/jpeg;base64,..."     │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
3. USER SAVES PROFILE
   ┌─────────────────────────────────────────────────┐
   │ handleSave(event)                               │
   │ ├─ if (selectedImageFile)                       │
   │ │  └─ Call uploadProfileImageByRole()           │
   │ ├─ Call updateProfileByRole()                   │
   │ └─ Refresh profile state                        │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
4. UPLOAD IMAGE TO API
   ┌─────────────────────────────────────────────────┐
   │ uploadProfileImageByRole(file, role)            │
   │                                                  │
   │ formData = new FormData()                       │
   │ formData.append('profile_image', file)          │
   │                                                  │
   │ POST /api/v1/{role}/profile/image               │
   │ Headers:                                         │
   │ ├─ Authorization: Bearer {token}                │
   │ └─ (Content-Type removed for multipart)         │
   │                                                  │
   │ Body: Multipart FormData with file             │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼ (Network Request)
5. BACKEND PROCESSES
   ┌─────────────────────────────────────────────────┐
   │ UserController / AdminController                │
   │ ├─ Receive file                                 │
   │ ├─ Validate (image|max:5120)                   │
   │ ├─ Store in public disk                         │
   │ ├─ Save path to user.profile_image              │
   │ └─ Return resolved URL                          │
   │                                                  │
   │ File stored at:                                  │
   │ storage/app/public/profile-images/user-id.jpg   │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
6. API RETURNS URL
   ┌─────────────────────────────────────────────────┐
   │ Response:                                        │
   │ {                                                │
   │   "profile_image": "https://api.../storage/...", │
   │   "avatar": "https://api.../storage/...",       │
   │   "name": "User Name",                          │
   │   ...                                            │
   │ }                                                │
   └──────────────┬──────────────────────────────────┘
                  │
                  ▼
7. UPDATE FRONTEND
   ┌─────────────────────────────────────────────────┐
   │ uploadProfileImageByRole() returns profile      │
   │ normalizeProfilePayload(profile)                │
   │ ├─ Extract avatar URL                           │
   │ ├─ Set photoPreview to new URL                  │
   │ └─ Update Redux state                           │
   │                                                  │
   │ Result: Avatar updates on page                  │
   └─────────────────────────────────────────────────┘

```

---

## 4. IMAGE URL RESOLUTION LOGIC

```
┌─────────────────────────────────────────────────────────────────┐
│            IMAGE URL RESOLUTION DECISION TREE                   │
└─────────────────────────────────────────────────────────────────┘

START: Image URL from database
   │
   ├─ Is it empty/null?
   │  ├─ YES → Return empty string ""
   │  └─ NO → Continue
   │
   ├─ Is it a full URL (http:// or https://)?
   │  ├─ YES → Return as-is
   │  └─ NO → Continue
   │
   ├─ Is it a blob: or data: URI?
   │  ├─ YES → Return null (security filter)
   │  └─ NO → Continue
   │
   ├─ Does it start with /storage/?
   │  ├─ YES → Return API_BASE_URL + path
   │  └─ NO → Continue
   │
   ├─ Does it start with storage/ (no leading /)?
   │  ├─ YES → Return API_BASE_URL + "/" + path
   │  └─ NO → Continue
   │
   ├─ Does it start with property-images/?
   │  ├─ YES → Return API_BASE_URL + "/storage/" + path
   │  └─ NO → Continue
   │
   └─ Treat as relative path
      └─ Return as-is (might be relative to current URL)

EXAMPLES:

Input: "property-images/abc123.jpg"
├─ Check: Starts with "property-images/"? YES
├─ Action: Prepend "https://api.../storage/"
└─ Output: "https://api.findhome.local/storage/property-images/abc123.jpg"

Input: "storage/profile-images/user1.jpg"
├─ Check: Starts with "storage/"? YES
├─ Action: Prepend "https://api.../""
└─ Output: "https://api.findhome.local/storage/profile-images/user1.jpg"

Input: "https://example.com/image.jpg"
├─ Check: Full URL? YES
├─ Action: Return unchanged
└─ Output: "https://example.com/image.jpg"

Input: null or ""
├─ Check: Empty? YES
├─ Action: Return empty/fallback
└─ Output: "" or fallback image URL

```

---

## 5. DATABASE IMAGE STRUCTURE

```
┌─────────────────────────────────────────────────────────────────┐
│               PROPERTIES TABLE (Images)                         │
└─────────────────────────────────────────────────────────────────┘

Properties Table:
┌────┬──────────────┬─────────────────────────┬───────────────────┐
│ id │ title        │ images (JSON)           │ image (STRING)    │
├────┼──────────────┼─────────────────────────┼───────────────────┤
│ 1  │ 2BR Apt      │ ["prop-img/p1.jpg",     │ "prop-img/p1.jpg" │
│    │ Dhanmondi    │  "prop-img/p2.jpg",     │                   │
│    │              │  "prop-img/p3.jpg"]     │                   │
├────┼──────────────┼─────────────────────────┼───────────────────┤
│ 2  │ Studio       │ ["prop-img/s1.jpg"]     │ "prop-img/s1.jpg" │
│    │ Banani       │                         │                   │
├────┼──────────────┼─────────────────────────┼───────────────────┤
│ 3  │ 3BR Duplex   │ ["prop-img/d1.jpg",     │ "prop-img/d1.jpg" │
│    │ Uttara       │  "prop-img/d2.jpg"]     │                   │
└────┴──────────────┴─────────────────────────┴───────────────────┘

JSON Format Example (images column):
[
  "property-images/abc123.jpg",
  "property-images/def456.jpg",
  "property-images/ghi789.jpg"
]

When returned to API:
┌─────────────────────────────────────────────────────────────────┐
│ {                                                                │
│   "id": 1,                                                       │
│   "title": "2BR Apartment",                                      │
│   "images": [                                                    │
│     "https://api.../storage/property-images/abc123.jpg",        │
│     "https://api.../storage/property-images/def456.jpg",        │
│     "https://api.../storage/property-images/ghi789.jpg"         │
│   ],                                                             │
│   "image": "https://api.../storage/property-images/abc123.jpg"  │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               USERS TABLE (Profile Images)                      │
└─────────────────────────────────────────────────────────────────┘

Users Table:
┌────┬─────────────┬──────────────────────────┬──────────────────┐
│ id │ name        │ avatar (STRING)          │ profile_image    │
├────┼─────────────┼──────────────────────────┼──────────────────┤
│ 1  │ John Doe    │ profile-images/user1.jpg │ (same as avatar) │
├────┼─────────────┼──────────────────────────┼──────────────────┤
│ 2  │ Jane Smith  │ null                     │ null             │
├────┼─────────────┼──────────────────────────┼──────────────────┤
│ 3  │ Admin User  │ profile-images/admin.jpg │ (same as avatar) │
└────┴─────────────┴──────────────────────────┴──────────────────┘

When returned to API:
┌─────────────────────────────────────────────────────────────────┐
│ {                                                                │
│   "id": 1,                                                       │
│   "name": "John Doe",                                            │
│   "avatar": "https://api.../storage/profile-images/user1.jpg",  │
│   "profile_image": "https://api.../storage/profile-images/user1.jpg"
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘

```

---

## 6. FILE SYSTEM STORAGE

```
Backend Project Structure:
backend/
├── storage/
│   ├── app/
│   │   ├── public/
│   │   │   ├── property-images/
│   │   │   │   ├── abc123uuid.jpg
│   │   │   │   ├── def456uuid.jpg
│   │   │   │   ├── ghi789uuid.jpg
│   │   │   │   └── ...
│   │   │   ├── profile-images/
│   │   │   │   ├── user1.jpg
│   │   │   │   ├── admin.jpg
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── logs/
│   │   └── ...
│   ├── framework/
│   └── logs/
├── public/
│   └── storage/ → (symlink to storage/app/public)
│       ├── property-images/ → (accessible via web)
│       └── profile-images/ → (accessible via web)
└── ...

Web Access:
localhost/storage/property-images/abc123.jpg
  ↓
/public/storage/property-images/abc123.jpg
  ↓
storage/app/public/property-images/abc123.jpg

API Response:
GET /api/v1/properties/1
Response:
{
  "images": ["property-images/abc123.jpg", ...]
}

Frontend:
normalizePropertyRecord() converts to:
{
  "images": [
    "https://api.../storage/property-images/abc123.jpg",
    ...
  ]
}

Browser Request:
GET https://api.../storage/property-images/abc123.jpg
  ↓
Laravel serves from public/storage/
  ↓
Image displays in <img> tag

```

---

## 7. COMPONENT HIERARCHY

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT TREE                               │
└─────────────────────────────────────────────────────────────────┘

App
├── Routes
│
├── Owner Dashboard
│   ├── Dashboard.jsx
│   │   └── Property Cards (with images)
│   │       └── <img src={house.image} />
│   │
│   ├── MyProperties.jsx
│   │   └── Property List (with images)
│   │       └── <img src={property.image} />
│   │
│   ├── AddProperty.jsx  ← IMAGE UPLOAD
│   │   └── Image Upload Section
│   │       ├── <input type="file" multiple />
│   │       └── Preview Grid
│   │           └── <img src={blob:...} />
│   │
│   └── PaymentHistory.jsx
│       └── Property Preview (with image)
│           └── <img src={property.image} />
│
├── Tenant Dashboard
│   ├── PropertyDetails.jsx
│   │   └── Image Gallery (3-image layout)
│   │       ├── <img src={property.images[0]} />
│   │       └── Thumbnails
│   │           ├── <img src={property.images[1]} />
│   │           └── <img src={property.images[2]} />
│   │
│   ├── Browseahome/ViewDetails.jsx
│   │   └── Image Gallery (same as above)
│   │
│   └── SavedHouses.jsx
│       └── Property Cards
│           └── <img src={property.image} />
│
├── Profile Pages
│   ├── MemberProfilePage.jsx  ← PROFILE IMAGE UPLOAD
│   │   ├── Avatar Circle
│   │   │   ├── <img src={photoPreview} />
│   │   │   └── <input type="file" accept="image/*" />
│   │   │
│   │   └── Profile Form
│   │       └── Save Button → uploadProfileImageByRole()
│   │
│   └── Admin/Dashboard/Profile.jsx  ← ADMIN PROFILE UPLOAD
│       └── Similar structure
│
└── Admin Dashboard
    ├── Dashboard.jsx
    │   └── Property Cards
    │       └── <img src={property.image} />
    │
    └── ManageProperties.jsx
        └── Property Grid
            └── <img src={property.image} />

Image Flow Through Components:
1. Raw data from API (storage-relative paths)
2. normalizePropertyRecord() in propertyStorage.js
3. Resolved URLs with full domain
4. Passed to Display Components
5. <img src={resolvedUrl} /> renders in DOM

```

---

## 8. STATE MANAGEMENT FOR IMAGES

```
┌─────────────────────────────────────────────────────────────────┐
│            IMAGE UPLOAD STATE MANAGEMENT                        │
└─────────────────────────────────────────────────────────────────┘

AddProperty.jsx State:
├── uploadedImages: string[]        ← Blob URLs for preview
│   └─ Example: ["blob:http://localhost/abc123"]
│   └─ Updated by: handleImageUpload()
│   └─ Used in: Grid display, preview
│
├── uploadedImageFiles: File[]      ← Actual File objects
│   └─ Example: [File{name: "photo1.jpg"}, ...]
│   └─ Updated by: handleImageUpload()
│   └─ Used in: FormData.append('images[]', file)
│
└── imageInputKey: number           ← Reset form input
    └─ Incremented after upload
    └─ Forces <input key={imageInputKey} /> to remount
    └─ Clears file picker state

MemberProfilePage.jsx State:
├── photoPreview: string            ← DataURL for preview
│   └─ Example: "data:image/jpeg;base64,..."
│   └─ Updated by: handlePhotoUpload()
│   └─ Used in: <img src={photoPreview} />
│
└── selectedImageFile: File         ← File object for upload
    └─ Updated by: handlePhotoUpload()
    └─ Used in: uploadProfileImageByRole(selectedImageFile)
    └─ Cleared after upload

propertyStorage.js (localStorage):
├── ownerProperties: Property[]     ← Stored properties
│   └─ images: string[] (resolved URLs after normalization)
│   └─ Updated by: saveProperty()
│   └─ Used in: fetchOwnerProperties()
│
└─ Data flow:
   1. Upload: File[] → FormData → API → storage-relative paths
   2. Response: storage-relative paths received
   3. Normalize: Storage paths → Full URLs
   4. Store: Save with full URLs to localStorage
   5. Display: Read from localStorage with full URLs

Redux State:
├── auth.user
│   ├── avatar: string              ← User avatar URL
│   ├── profile_image: string       ← Same as avatar
│   └─ Updated by: updateUserProfileSuccess()
│
└─ Updated after profile image upload
   1. uploadProfileImageByRole(file) → API
   2. API returns updated user with new avatar
   3. dispatch(updateUserProfileSuccess(newUser))
   4. Redux state updated
   5. Components re-render with new avatar

Memory/Cleanup:
├── Blob URLs created: URL.createObjectURL(file)
│   └─ Should be revoked: URL.revokeObjectURL(blobUrl)
│   └─ Currently: Not revoked (minor memory leak)
│   └─ Note: Automatically revoked when tab closes
│
└─ File inputs
    └─ Cleared by: imageInputKey change
    └─ Forces remount of <input /> element

```

---

## 9. API ENDPOINTS SUMMARY

```
┌─────────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                                │
└─────────────────────────────────────────────────────────────────┘

PROPERTY IMAGES:

POST /api/v1/properties
├─ Create new property with images
├─ Body: FormData (multipart)
│  ├─ title, category, type, location, price, ...
│  └─ images[] (File array)
├─ Auth: Required (owner)
├─ Response: Created property with full image URLs
└─ Status: 201 Created

PUT /api/v1/properties/{id}
├─ Update property including images
├─ Body: FormData (multipart)
│  ├─ [optional] fields to update
│  └─ [optional] images[] (new files)
├─ Auth: Required (property owner)
├─ Response: Updated property
└─ Status: 200 OK

GET /api/v1/properties
├─ Get all properties
├─ Query: location (optional search)
├─ Auth: Not required
├─ Response: Array of properties (with resolved image URLs)
└─ Status: 200 OK

GET /api/v1/properties/{id}
├─ Get single property
├─ Auth: Not required
├─ Response: Property object (with resolved URLs)
└─ Status: 200 OK

GET /api/v1/owner/properties
├─ Get owner's properties
├─ Auth: Required (owner)
├─ Response: Array of owner's properties
└─ Status: 200 OK

PROFILE IMAGES:

POST /api/v1/user/profile/image
├─ Upload tenant profile image
├─ Body: FormData (multipart)
│  └─ profile_image (File)
├─ Auth: Required (tenant)
├─ Response: Updated user with avatar URL
└─ Status: 200 OK

POST /api/v1/admin/profile/image
├─ Upload admin profile image
├─ Body: FormData (multipart)
│  └─ profile_image (File)
├─ Auth: Required (admin)
├─ Response: Updated admin with avatar URL
└─ Status: 200 OK

PUT /api/v1/user/profile
├─ Update tenant profile (without images)
├─ Body: JSON {name, email, phone}
├─ Auth: Required (tenant)
├─ Response: Updated user
└─ Status: 200 OK

PUT /api/v1/admin/profile
├─ Update admin profile (without images)
├─ Body: JSON {name, email, phone}
├─ Auth: Required (admin)
├─ Response: Updated admin
└─ Status: 200 OK

```

---

## 10. KEY FILE LOCATIONS

```
FRONTEND:

Upload Components:
  frontend/src/pages/Owner/Dashboard/AddProperty.jsx
    ├─ handleImageUpload() - Line 137
    ├─ handleRemoveImage() - Line 149
    └─ Image UI Section - Line 660
  
  frontend/src/components/profile/MemberProfilePage.jsx
    ├─ handlePhotoUpload() - Line 240
    └─ Avatar Section - Line 365
  
  frontend/src/pages/Admin/Dashboard/Profile.jsx
    ├─ handlePhotoUpload() - Line 111
    └─ Avatar Section - Line 285

API Services:
  frontend/src/utils/propertyStorage.js
    ├─ buildPropertyRequestBody() - Line 77
    ├─ saveProperty() - Line 250
    ├─ normalizePropertyRecord() - Line 151
    └─ Image resolution - Line 175
  
  frontend/src/utils/userProfileService.js
    └─ uploadProfileImageByRole() - Line 120
  
  frontend/src/utils/http.js
    └─ HTTP client setup
  
  frontend/src/utils/avatarHelper.js
    ├─ resolveAvatarUrl() - Line 9
    └─ getAvatarUrl() - Line 29

Display Components:
  frontend/src/pages/Owner/Dashboard/Dashboard.jsx
    └─ Property cards with images - Line 125
  
  frontend/src/pages/Owner/Dashboard/MyProperties.jsx
    └─ Property list - Line 175
  
  frontend/src/pages/User/Dashboard/PropertyDetails.jsx
    └─ Image gallery - Line 217
  
  frontend/src/pages/User/Dashboard/Browseahome/ViewDetails.jsx
    └─ Browsable property gallery - Line 98
  
  frontend/src/pages/User/Dashboard/SavedHouses.jsx
    └─ Saved properties - Line 40
  
  frontend/src/pages/Admin/Dashboard/ManageProperties.jsx
    └─ Admin properties - Line 90

BACKEND:

Controllers:
  backend/app/Http/Controllers/Api/V1/PropertyController.php
    ├─ store() - Line 271 - Create property with images
    ├─ update() - Line 367 - Update property images
    ├─ storePropertyImages() - Line 79 - File storage logic
    ├─ resolvePropertyMediaUrl() - Line 30 - URL resolution
    └─ mapPropertyWithOwner() - Line 121 - Add URLs to response

Models:
  backend/app/Models/Property.php
    ├─ images - JSON array column
    └─ image - String column for main thumbnail
  
  backend/app/Models/User.php
    ├─ avatar - String column
    └─ profile_image - String column

Configuration:
  backend/config/filesystems.php
    └─ 'public' disk configuration
  
  backend/.env
    └─ APP_URL configuration

```

---

**Visual Architecture Documentation Complete**  
**Generated:** May 18, 2026  
**All diagrams and flows included for image handling system**
