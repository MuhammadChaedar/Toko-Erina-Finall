# Backend File Upload Update - Developer Guide

## Overview
Backend telah diupdate untuk menerima image sebagai **File** (multipart/form-data) bukan lagi base64. Ini meningkatkan performa dan mengurangi ukuran request payload.

## Changes Summary

### 1. Updated Services
- **CloudinaryService.php**
  - New method: `uploadFile(UploadedFile $file, string $folder, ?string $publicId = null): array`
  - Uses `Http::asMultipart()` for proper file handling
  - Maintains compatibility with existing `uploadBase64()` method

### 2. Updated Controllers
- **ProductController.php**
  - `store()` method: Changed from `image_base64` to `image` (file)
  - `update()` method: Added file upload support
  - Both methods now support multipart/form-data requests

## Validation Rules

### Create Product
```php
'image' => 'required_without:image_url|nullable|image|mimes:jpeg,png,webp,gif|max:5120'
```
- **Size limit**: 5MB (5120KB)
- **Supported formats**: JPEG, PNG, WebP, GIF
- **Required if**: No `image_url` provided

### Update Product
```php
'image' => 'nullable|image|mimes:jpeg,png,webp,gif|max:5120'
```
- All fields optional
- File upload optional for updates

## API Usage Examples

### Curl - Create Product with File Upload
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Keripik Tempe" \
  -F "flavor=Original" \
  -F "description=Keripik tempe goreng khas" \
  -F "price=25000" \
  -F "image=@/path/to/image.jpg" \
  -F "stock_status=available" \
  -F "is_featured=true"
```

### JavaScript/Fetch - Create Product
```javascript
const formData = new FormData();
formData.append('name', 'Keripik Tempe');
formData.append('flavor', 'Original');
formData.append('description', 'Keripik tempe goreng khas');
formData.append('price', 25000);
formData.append('image', imageFile); // File object from input
formData.append('stock_status', 'available');
formData.append('is_featured', true);

fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
    // Don't set Content-Type, browser will set it automatically
  },
  body: formData
});
```

### Python - Create Product
```python
import requests

url = 'http://localhost:3000/api/products'
headers = {'Authorization': 'Bearer YOUR_TOKEN'}

files = {'image': open('image.jpg', 'rb')}
data = {
    'name': 'Keripik Tempe',
    'flavor': 'Original',
    'description': 'Keripik tempe goreng khas',
    'price': 25000,
    'stock_status': 'available',
    'is_featured': True
}

response = requests.post(url, headers=headers, files=files, data=data)
```

### Postman - Setup
1. Request method: **POST**
2. URL: `{{base_url}}/api/products`
3. Headers: Set `Authorization` to `Bearer {{access_token}}`
4. Body type: **form-data**
5. Form fields:
   - `name` (text): Product name
   - `flavor` (text): Flavor/Category
   - `description` (text): Product description
   - `price` (text): Price in rupiah (e.g., "25000")
   - `image` (file): Image file
   - `stock_status` (text): "available" | "limited" | "out_of_stock"
   - `is_featured` (text): "true" | "false"

## Update Product with File Upload

### Curl - Update with New Image
```bash
curl -X PUT http://localhost:3000/api/products/product-id-uuid \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Updated Name" \
  -F "price=30000" \
  -F "image=@/path/to/new-image.jpg"
```

### JavaScript - Update with Optional Image
```javascript
const formData = new FormData();
formData.append('name', 'Updated Name');
formData.append('price', 30000);

// Only add image if user selected a new one
if (newImageFile) {
  formData.append('image', newImageFile);
}

fetch('http://localhost:3000/api/products/product-id-uuid', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
});
```

## Still Supported

### Using Image URL (no file upload)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "flavor": "Original",
    "description": "Description",
    "price": 25000,
    "image_url": "https://example.com/image.jpg",
    "stock_status": "available"
  }'
```

## Error Responses

### Invalid Image Format
```json
{
  "message": "The image must be an image.",
  "errors": {
    "image": ["The image must be an image."]
  }
}
```

### File Too Large
```json
{
  "message": "The image field must not be greater than 5120 kilobytes.",
  "errors": {
    "image": ["The image field must not be greater than 5120 kilobytes."]
  }
}
```

### Missing Both Image and Image URL
```json
{
  "message": "The image field is required when image url is not present.",
  "errors": {
    "image": ["The image field is required when image url is not present."]
  }
}
```

## Migration Notes for Frontend

### Before (Base64)
```javascript
// Read file as base64
const reader = new FileReader();
reader.onload = (e) => {
  const imageBase64 = e.target.result; // data:image/jpeg;base64,...
  // Send as image_base64 in JSON
};
reader.readAsDataURL(imageFile);
```

### After (File Upload)
```javascript
// Use FormData directly
const formData = new FormData();
formData.append('image', imageFile); // Just pass the file object!
// No need to convert to base64
```

## Benefits of This Change
✅ **Smaller payload size** - No base64 encoding overhead (33% reduction)
✅ **Faster uploads** - Binary data is more efficient
✅ **Better compatibility** - Standard multipart/form-data format
✅ **Automatic validation** - Laravel validates file type and size
✅ **Backward compatible** - `image_url` parameter still works

## Questions or Issues?
Refer to the endpoint implementation in:
- `app/Http/Controllers/Api/ProductController.php`
- `app/Services/CloudinaryService.php`
