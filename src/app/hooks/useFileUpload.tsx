import { useState } from "react";
import toast from "react-hot-toast";
import { apiService } from "../services/api";

export const useFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const uploadProfileImage = async (file: File) => {
    const uploadToast = toast.loading("Uploading profile image...");
    setIsLoading(true);

    try {
      const imageUrl = await apiService.uploadProfileImage(file);
      toast.success("Profile image uploaded successfully!", {
        id: uploadToast,
      });
      return imageUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.", {
        id: uploadToast,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (
    file: File,
    onSuccess: (imageUrl: string) => void
  ) => {
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const imageUrl = await uploadProfileImage(file);
      onSuccess(imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      setImagePreview(null);
    }
  };

  return {
    isLoading,
    imagePreview,
    handleImageChange,
    setImagePreview,
  };
};
