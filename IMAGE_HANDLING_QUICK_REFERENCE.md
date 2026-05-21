# Image Handling - Quick Reference Guide

## 🚀 Quick Navigation

### Need to...

#### Upload Property Images?
- **File:** [frontend/src/pages/Owner/Dashboard/AddProperty.jsx](frontend/src/pages/Owner/Dashboard/AddProperty.jsx#L137-L147)
- **State:** `uploadedImages` (preview), `uploadedImageFiles` (actual files)
- **API:** POST `/api/v1/properties` with FormData

#### Upload Profile Images?
- **Tenant:** [frontend/src/components/profile/MemberProfilePage.jsx](frontend/src/components/profile/MemberProfilePage.jsx#L240-L250)
- **Admin:** [frontend/src/pages/Admin/Dashboard/Profile.jsx](frontend/src/pages/Admin/Dashboard/Profile.jsx#L111-L122)
- **API:** POST `/api/v1/{user|admin}/profile/image`

#### Display Property Images?
- **Dashboard:** [frontend/src/pages/Owner/Dashboard/Dashboard.jsx](frontend/src/pages/Owner/Dashboard/Dashboard.jsx#L125-L175)
- **Details Page:** [frontend/src/pages/User/Dashboard/Browseahome/ViewDetails.jsx](frontend/src/pages/User/Dashboard/Browseahome/ViewDetails.jsx#L110-L140)
- **Pattern:** `property.image || property.images?.[0] || fallback`

#### Handle Image Storage (Backend)?
- **File:** [backend/app/Http/Controllers/Api/V1/PropertyController.php](backend/app/Http/Controllers/Api/V1/PropertyController.php#L79-L118)
- **Method:** `storePropertyImages(Request $request, array $existingImages = [])`
- **Storage Path:** `storage/app/public/property-images/`

#### Resolve Image URLs?
- **Property Images:** [frontend/src/utils/propertyStorage.js](frontend/src/utils/propertyStorage.js#L175-L205)
- **Function:** `normalizePropertyRecord(property)`
- **Avatar Images:** [frontend/src/utils/avatarHelper.js](frontend/src/utils/avatarHelper.js#L9-L27)

---

## 📊 API Endpoints

### Property Images
```
POST   /api/v1/properties              Create property with images
PUT    /api/v1/properties/{id}         Update property images
GET    /api/v1/properties              Get all properties (with images)
GET    /api/v1/properties/{id}         Get single property
```

### Profile Images
```
POST   /api/v1/user/profile/image      Upload tenant profile image
POST   /api/v1/admin/profile/image     Upload admin profile image
PUT    /api/v1/user/profile            Update tenant profile
PUT    /api/v1/admin/profile           Update admin profile
```

---

## 🔑 Key Functions

### Frontend Uploads

#### AddProperty.jsx
```javascript
handleImageUpload(event)          // Lines 137-147 - Add preview images
handleRemoveImage(imageIndex)     // Lines 149-156 - Remove image
buildPropertyRequestBody()        // propertyStorage.js - Prepare FormData
saveProperty(property)            // propertyStorage.js - Send to API
```

#### MemberProfilePage.jsx
```javascript
handlePhotoUpload(event)          // Lines 240-250 - Preview single image
handleSave(event)                 // Lines 260-345 - Upload to API
uploadProfileImageByRole()        // userProfileService.js - API call
```

### API Service

#### userProfileService.js
```javascript
uploadProfileImageByRole(file, role)  // Lines 120-145
// POST /api/v1/{user|admin}/profile/image
// Returns: { avatar: url, profile_image: url, ... }
```

#### propertyStorage.js
```javascript
saveProperty(property)            // Lines 250-310 - Create/update property
buildPropertyRequestBody()        // Lines 77-140 - Format FormData
normalizePropertyRecord()         // Lines 151-232 - Resolve image URLs
```

### Backend Processing

#### PropertyController.php
```php
storePropertyImages()             // Lines 79-118 - Store files, return paths
resolvePropertyMediaUrl()         // Lines 30-59 - Convert to full URLs
normalizeList()                   // Lines 61-76 - Parse arrays
mapPropertyWithOwner()            // Lines 121-178 - Add URLs to response
```

### Image Resolution

#### propertyStorage.js
```javascript
resolveImageUrl(img)              // Lines 188-205
// Converts: property-images/pic1.jpg
// To: https://api.../storage/property-images/pic1.jpg
```

#### avatarHelper.js
```javascript
resolveAvatarUrl(avatar)          // Lines 9-27
getAvatarUrl(source)              // Lines 29-35
```

---

## 📁 Storage Structure

### Database Columns
```sql
-- properties table
images    JSON     null  -- ["property-images/pic1.jpg", ...]
image     STRING   null  -- "property-images/pic1.jpg" (main)

-- users table (owner/tenant)
avatar           STRING  null  -- Profile image path
profile_image    STRING  null  -- Same as avatar
```

### File System
```
backend/storage/app/public/
├── property-images/
│   ├── uuid-filename-1.jpg
│   ├── uuid-filename-2.jpg
│   └── ...
└── profile-images/
    ├── user-1.jpg
    └── ...
```

### Public Access
```
GET /storage/property-images/uuid-filename.jpg
GET /storage/profile-images/user-1.jpg
```

---

## 🎨 Frontend Display Patterns

### Property Image Preview
```jsx
<img 
  src={property.image || property.images?.[0] || "placeholder.jpg"}
  alt={property.title}
  className="w-full h-full object-cover"
/>
```

### Property Gallery (3-image)
```jsx
{/* Main image */}
<img src={property.images[0]} className="w-full h-[450px]" />

{/* Thumbnails */}
<div className="grid grid-cols-2">
  <img src={property.images[1]} className="h-48" />
  <img src={property.images[2]} className="h-48" />
</div>
```

### Avatar Profile
```jsx
<div className="w-24 h-24 rounded-full overflow-hidden">
  {photoPreview ? (
    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    <User size={48} />
  )}
</div>
```

---

## ✅ Validation Rules

### Image File Validation (Backend)
```php
'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
// - Must be image file
// - Allowed: jpg, jpeg, png, webp
// - Max: 5MB per image
```

### Frontend Pre-validation
```javascript
// Property upload - AddProperty.jsx
accept="image/*"    // Only accept image files

// Profile upload - MemberProfilePage.jsx
accept="image/*"    // Only accept image files
```

---

## 🐛 Common Issues & Solutions

### Images Not Displaying
**Problem:** `<img>` shows 404 or broken
**Solution:**
1. Check `normalizePropertyRecord()` is being called
2. Verify `API_BASE_URL` is set in .env
3. Check Laravel logs: `tail -f backend/storage/logs/laravel.log`
4. Test URL directly in browser

### Upload Fails Silently
**Problem:** No error message, image doesn't upload
**Solution:**
1. Check browser console for errors (F12)
2. Check Network tab for API response status
3. Verify `uploadedImageFiles` contains actual File objects
4. Check Laravel logs for validation errors

### Profile Image Not Updating
**Problem:** Image uploads but doesn't show
**Solution:**
1. Verify `uploadProfileImageByRole()` returns URL
2. Check `getAvatarUrl()` is normalizing response
3. Verify `photoPreview` state is updated
4. Clear browser cache and reload

### FormData Not Sending Correctly
**Problem:** Backend receives empty images
**Solution:**
1. Verify `buildPropertyRequestBody()` is called
2. Check `uploadedImageFiles` has File objects
3. Ensure `FormData.append('images[]', file)` for each
4. Verify http.js strips Content-Type for FormData

---

## 🔒 Security Considerations

### ✅ Implemented
- MIME type validation (`image|mimes:...`)
- File size limits (5MB max)
- Authorization checks (API requires auth)
- Blob/data URI filtering (prevents XSS)

### 🛡️ Manual Checks Needed
- No unauthorized image deletion
- Verify storage permissions
- Check disk space monitoring
- Implement rate limiting if needed

---

## 📋 Testing Checklist

### Property Image Upload
- [ ] Upload single image - shows in preview
- [ ] Upload multiple images - all display
- [ ] Remove image - updates display and state
- [ ] Submit form - images saved to database
- [ ] Edit property - existing images load
- [ ] Images display in dashboard after upload

### Profile Image Upload
- [ ] Upload profile image - shows preview immediately
- [ ] Submit profile - image saved to database
- [ ] Load profile - image displays on page
- [ ] Edit profile - existing image loads
- [ ] Admin and tenant both work

### Image Display
- [ ] Owner dashboard - all images visible
- [ ] My properties - images display correctly
- [ ] Property details - gallery shows all 3 images
- [ ] Saved houses - images visible
- [ ] Admin properties - images showing
- [ ] Browse properties - images in cards

---

## 🚀 Performance Tips

1. **Image Optimization**
   ```javascript
   // Compress before upload (future)
   const canvas = document.createElement('canvas');
   // Resize and compress image
   ```

2. **Lazy Loading**
   ```jsx
   <img src={url} loading="lazy" />
   ```

3. **Responsive Images**
   ```jsx
   <img 
     src={url} 
     srcSet={`${url}?w=400 400w, ${url}?w=800 800w`}
   />
   ```

4. **Object-Fit for Consistency**
   ```jsx
   className="object-cover"  // Always use for galleries
   ```

---

## 📞 Support Resources

### Files to Review
1. Full Overview: [IMAGE_HANDLING_OVERVIEW.md](IMAGE_HANDLING_OVERVIEW.md)
2. AddProperty Component: [AddProperty.jsx](frontend/src/pages/Owner/Dashboard/AddProperty.jsx)
3. Property Storage: [propertyStorage.js](frontend/src/utils/propertyStorage.js)
4. Property Controller: [PropertyController.php](backend/app/Http/Controllers/Api/V1/PropertyController.php)

### Key Implementation Details
- See `handleImageUpload()` for upload flow
- See `buildPropertyRequestBody()` for FormData creation
- See `storePropertyImages()` for backend processing
- See `normalizePropertyRecord()` for URL resolution

---

**Last Updated:** May 18, 2026  
**Version:** 1.0  
**Status:** Current Implementation
