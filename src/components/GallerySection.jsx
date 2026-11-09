
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";

function GallerySection() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");

    const galleryQuery = query(
      collection(db, "wedding-photos"),
      orderBy("uploadedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      galleryQuery,
      (snapshot) => {
        const uploadedMemories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMemories(uploadedMemories);
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error("Gallery error:", err);
        setError("Unable to load wedding memories.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [retryCount]);

  const closeViewer = () => setSelectedIndex(null);

  const showNext = () => {
    setSelectedIndex((previous) =>
      (previous + 1) % memories.length
    );
  };

  const showPrevious = () => {
    setSelectedIndex((previous) =>
      (previous - 1 + memories.length) % memories.length
    );
  };

  const selectedMemory =
    selectedIndex !== null ? memories[selectedIndex] : null;

  return (
    <section className="gallery-section">
      <h2>Our Wedding Memories</h2>
      <p>Beautiful moments shared by our loved ones ❤️</p>

      {loading && <p>Loading memories...</p>}

      {error && (
        <div className="gallery-error">
          <p>{error}</p>
          <button onClick={() => setRetryCount((p) => p + 1)}>
            Try Again ↻
          </button>
        </div>
      )}

      {!loading && !error && memories.length === 0 && (
        <p>No memories uploaded yet. Be the first to share!</p>
      )}

      <div className="gallery-grid">
        {memories.map((memory, index) => (
          <div className="gallery-item" key={memory.id}>
            {memory.resourceType === "video" ? (
              <>
                <video
                  src={memory.url}
                  controls
                  preload="metadata"
                />
                <button
                  className="view-memory"
                  onClick={() => setSelectedIndex(index)}
                >
                  View Video
                </button>
              </>
            ) : (
              <img
                src={memory.url}
                alt="Wedding memory"
                loading="lazy"
                onClick={() => setSelectedIndex(index)}
              />
            )}
          </div>
        ))}
      </div>

      {selectedMemory && (
        <div className="lightbox" onClick={closeViewer}>
          <button
            className="lightbox-close"
            onClick={closeViewer}
            aria-label="Close viewer"
          >
            ×
          </button>

          <button
            className="lightbox-nav previous"
            onClick={(e) => {
              e.stopPropagation();
              showPrevious();
            }}
          >
            ❮
          </button>

          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMemory.resourceType === "video" ? (
              <video
                key={selectedMemory.id}
                src={selectedMemory.url}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={selectedMemory.url}
                alt="Wedding memory"
              />
            )}
          </div>
<a
  className="lightbox-download"
  href={selectedMemory.url.replace(
    "/upload/",
    "/upload/fl_attachment/"
  )}
>
  ↓ Download
</a>
          <button
            className="lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
          >
            ❯
          </button>
        </div>
      )}
    </section>
  );
}

export default GallerySection;
