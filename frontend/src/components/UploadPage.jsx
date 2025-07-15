import React, { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const uploaderId = localStorage.getItem("userId");

    // 1️⃣ Get signed URL
    const res = await axios.post("http://localhost:4000/upload/generate-upload-url", {
      fileName: file.name,
      fileType: file.type,
    });

    // 2️⃣ Upload file (no extra metadata)
    await axios.put(res.data.uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    // 3️⃣ Save metadata to DB
    await axios.post("http://localhost:4000/upload/save-metadata", {
      key: res.data.key,
      title,
      description,
      uploader_id: uploaderId,
    });

    alert("Uploaded!");

    setFile(null);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload Podcast</h1>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Select File</span>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2 block w-full text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Title</span>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Description</span>
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </label>

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
