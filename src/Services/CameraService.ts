import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const takePhoto = async (): Promise<string | null> => {
  try {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    return image.dataUrl ?? null;
  } catch (error) {
    console.error('Camera error:', error);
    return null;
  }
};

// Cloudinary upload - FREE
export const uploadToCloudinary = async (imageData: string): Promise<string | null> => {
  try {
    console.log('=== UPLOADING TO CLOUDINARY ===');
    
    // 👇 REPLACE THIS WITH YOUR ACTUAL CLOUDINARY CLOUD NAME
    const CLOUD_NAME = 'dzbfya7ls'; 
    const UPLOAD_PRESET = 'mood_tracker';
    
    const formData = new FormData();
    formData.append('file', imageData);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    console.log('Cloudinary response:', data);
    
    if (data.secure_url) {
      console.log('✅ Photo uploaded! URL:', data.secure_url);
      return data.secure_url;
    } else {
      console.error('❌ Upload failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    return null;
  }
};

// Edit photo - take new photo and upload
export const editPhoto = async (currentPhotoUrl: string | null): Promise<string | null> => {
  try {
    console.log('Editing photo...');
    const newPhotoData = await takePhoto();
    if (newPhotoData) {
      const newPhotoUrl = await uploadToCloudinary(newPhotoData);
      return newPhotoUrl || currentPhotoUrl; // Keep current if new upload fails
    }
    return currentPhotoUrl; // Keep current photo if new one fails
  } catch (error) {
    console.error('Edit photo error:', error);
    return currentPhotoUrl;
  }
};

// Remove photo - returns null to indicate no photo
export const removePhoto = async (): Promise<null> => {
  console.log('Photo removal requested');
  return null;
};