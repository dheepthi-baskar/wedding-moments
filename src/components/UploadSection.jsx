
import { useEffect, useState } from "react";
import { uploadToCloudinary } from "../cloudinary";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

function UploadSection() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      files.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [files]);

  const addFiles = (selectedFiles) => {
    const validFiles = [];

    Array.from(selectedFiles).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        alert(`${file.name}: Unsupported file type.`);
        return;
      }

      const maxSize = isVideo
        ? 50 * 1024 * 1024
        : 10 * 1024 * 1024;

      if (file.size > maxSize) {
        alert(`${file.name}: File exceeds the size limit.`);
        return;
      }

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
        isVideo,
      });
    });

    setFiles((previous) => [...previous, ...validFiles]);
    setMessage("");
  };

  const removeFile = (index) => {
    setFiles((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const handleUpload = async () => {
    if (!files.length) {
      setMessage("Please select some memories first.");
      return;
    }

    setUploading(true);
    setMessage("");

    let successCount = 0;

    try {
      for (const item of files) {
        const uploaded = await uploadToCloudinary(item.file);

        await addDoc(collection(db, "wedding-photos"), {
          url: uploaded.url,
          publicId: uploaded.publicId,
          resourceType: uploaded.resourceType,
          originalName: uploaded.originalName,
          uploadedAt: serverTimestamp(),
        });

        successCount++;
      }

      setFiles([]);
      setMessage(`${successCount} memories uploaded successfully! ❤️`);
    } catch (error) {
      console.error(error);
      setMessage(
        `${successCount} uploaded. Some files failed: ${error.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="upload-section">
      <p className="eyebrow">SHARE THE HAPPINESS</p>

      <h2>Share Your Memories</h2>

      <p>
        Every picture tells a story. Share the beautiful
        moments you captured with Thilak & Jyotsna.
      </p>

      <div
        className={`upload-placeholder ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <div className="upload-icon">♡</div>

        <h3>Drop your memories here</h3>

        <p>Or select photos and videos from your device</p>

        <label className="choose-files">
          Choose Files
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
            multiple
            disabled={uploading}
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>

      </div>

      {files.length > 0 && (
        <div className="preview-section">
          <h3>Selected Memories ({files.length})</h3>

          <div className="preview-grid">
            {files.map((item, index) => (
              <div className="preview-item" key={index}>
                {item.isVideo ? (
                  <video src={item.preview} controls />
                ) : (
                  <img src={item.preview} alt="Selected memory" />
                )}

                <button
                  type="button"
                  className="remove-file"
                  disabled={uploading}
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            className="upload-submit"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Memories ❤️"}
          </button>
        </div>
      )}

      {message && <p className="upload-message">{message}</p>}
    </section>
  );
}

export default UploadSection;
