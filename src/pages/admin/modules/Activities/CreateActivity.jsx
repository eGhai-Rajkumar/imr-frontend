import React, { useState } from "react";
import axios from "axios";

export default function CreateActivity({
  open,
  setOpen,
  activityData,
  setActivityData,
  isUpdate,
  setIsUpdate,
  getAllActivities,
  showAlert,
}) {
  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  const API_URL = "https://api.yaadigo.com/secure/api/activities/";
  const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData((prev) => ({ ...prev, [name]: value }));
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    console.log('🟢 handleImageUpload called');
    const file = e.target.files[0];
    if (!file) {
      console.log('⚠️ No file selected');
      return;
    }

    const fileType = file.type.split("/")[1];
    const allowed = ["jpg", "jpeg", "png", "webp"];
    if (!allowed.includes(fileType)) {
      console.log('❌ Invalid file type:', fileType);
      showAlert("Only JPG, PNG, or WEBP files are allowed", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size, 'bytes');
      showAlert("Image size should be less than 5MB", "error");
      return;
    }

    console.log('📎 File to upload:', file.name, file.size, 'bytes');
    const formData = new FormData();
    formData.append("image", file);
    formData.append("storage", "local");

    try {
      setUploading(true);
      console.log('📤 Uploading to: https://api.yaadigo.com/upload');
      const res = await axios.post("https://api.yaadigo.com/upload", formData);
      console.log('📥 Upload response:', res.data);
      if (res?.data?.message === "Upload successful") {
        setActivityData((prev) => ({ ...prev, image: res.data.url }));
        console.log('✅ Image URL set:', res.data.url);
        showAlert("Image uploaded successfully");
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      console.error('❌ Error response:', err.response?.data);
      showAlert("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // Create new activity
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔵 handleSubmit called with data:', activityData);

    try {
      console.log('📤 Sending POST request to:', API_URL);
      const res = await axios.post(
        API_URL,
        { ...activityData, tenant_id: 1 },
        { headers: { "x-api-key": API_KEY } }
      );
      console.log('📥 Response received:', res.data);
      if (res.data.success) {
        showAlert("Activity created successfully");
        getAllActivities();
        setOpen(false);
      } else {
        console.log('⚠️ Create failed:', res.data.message);
        showAlert(res.data.message || "Failed to create activity", "error");
      }
    } catch (err) {
      console.error('❌ Create error:', err);
      console.error('❌ Error response:', err.response?.data);
      showAlert("Error saving activity", "error");
    }
  };

  // Update existing activity
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log('🟡 handleUpdate called with data:', activityData);
    try {
      const id = activityData.id || activityData._id;
      console.log('📤 Sending PUT request to:', `${API_URL}${id}`);
      const res = await axios.put(
        `${API_URL}${id}`,
        { ...activityData, tenant_id: 1 },
        { headers: { "x-api-key": API_KEY } }
      );
      console.log('📥 Response received:', res.data);
      if (res.data.success) {
        showAlert("Activity updated successfully");
        getAllActivities();
        setOpen(false);
        setIsUpdate(false);
      } else {
        console.log('⚠️ Update failed:', res.data.message);
        showAlert(res.data.message || "Failed to update activity", "error");
      }
    } catch (err) {
      console.error('❌ Update error:', err);
      console.error('❌ Error response:', err.response?.data);
      showAlert("Error updating activity", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {isUpdate ? "Update Activity" : "Add Activity"}
        </h2>

        <form onSubmit={isUpdate ? handleUpdate : handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="block font-semibold mb-1 text-gray-700">
              Activity Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={activityData.name || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter activity name"
              required
            />
          </div>

          {/* Slug */}
          <div className="mb-3">
            <label className="block font-semibold mb-1 text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={activityData.slug || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter slug"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block font-semibold mb-1 text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={activityData.description || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter description"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-700">
              Activity Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleImageUpload}
              className="w-full border p-2 rounded bg-white"
            />
            {uploading && (
              <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
            )}

            {/* Preview */}
            {activityData.image && (
              <div className="mt-3 flex justify-center">
                <img
                  src={activityData.image}
                  alt="Activity Preview"
                  className="rounded-lg shadow-md w-40 h-40 object-cover border"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {isUpdate ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
