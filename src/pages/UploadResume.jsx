import { useState } from "react";
import { uploadFile,deleteFile } from "../firebase/helperFunction";
export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [uploadedPath, setUploadedPath] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚠️ Hardcoded only for testing
  const userId = "test-user-123";

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    try {
      setLoading(true);

      const result = await uploadFile({
        file,
        bucket: "uploads",
        userId,
        folder: "test",
      });

      setUploadedPath(result.path);
      alert("File uploaded successfully ✅");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!uploadedPath) return;

    try {
      await deleteFile({
        bucket: "uploads",
        filePath: uploadedPath,
      });

      setUploadedPath("");
      alert("File deleted successfully 🗑️");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl border shadow-sm bg-white space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Supabase File Upload Test
      </h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:text-sm file:font-medium
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />

      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg
                     hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <button
          onClick={handleDelete}
          disabled={!uploadedPath}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg
                     hover:bg-red-600 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      {uploadedPath && (
        <div className="text-xs text-gray-500 break-all bg-gray-50 p-2 rounded">
          <strong>Uploaded Path:</strong>
          <br />
          {uploadedPath}
        </div>
      )}
    </div>
  );
}
