const uploadGoogleProfilePic = async (googleImageUrl) => {
  if (!googleImageUrl) return "";

  try {
    // 🔥 Convert Google URL → Blob (more reliable than direct URL upload)
    const response = await fetch(googleImageUrl);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "vrumies_preset"); // your preset

    const uploadRes = await fetch(
      "https://api.cloudinary.com/v1_1/dmjvngk3o/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await uploadRes.json();

    return data.secure_url || googleImageUrl; // fallback if something fails
  } catch (err) {
    console.error("Cloudinary Google upload failed:", err);
    return googleImageUrl; // fallback
  }
};

export default uploadGoogleProfilePic;