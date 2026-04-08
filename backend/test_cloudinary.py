import cloudinary
import cloudinary.uploader

# Configure Cloudinary
cloudinary.config(
    cloud_name="diupi3p3d",
    api_key="286629725342625",
    api_secret="RjuP1PYEwUMX3EFJSY4VAMvHeXQ" 
)

# Test upload
print("Testing Cloudinary connection...")
try:
    # Upload a simple test image (a small base64 image)
    test_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    result = cloudinary.uploader.upload(test_image)
    print(f"✅ Success! Uploaded to: {result['secure_url']}")
except Exception as e:
    print(f"❌ Error: {e}")
