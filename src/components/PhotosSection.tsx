import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

// Thumbnails are generated into `thumbs/` per meetup and are the only image size we ship to the gallery.
const meetupThumbModules = import.meta.glob(
  "/src/content/images-meetup/meetup-*/thumbs/[^/]*",
  { query: "?url", import: "default", eager: true }
);

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface Photo {
  key: string;
  filename: string;
  meetupNumber: number;
  thumbUrl?: string | null;
}

// Skeleton placeholder component
function SkeletonLoader() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-background/50 via-background/30 to-background/50 animate-pulse flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cyber-blue/20">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
        </div>
        <p className="text-xs text-muted-foreground font-medium">Loading...</p>
      </div>
    </div>
  );
}

function ImageModal({
  photo,
  onClose,
}: {
  photo: Photo | null;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!photo) {
      setPhotoUrl(null);
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    setPhotoUrl(photo.thumbUrl ?? null);
  }, [photo]);

  useEffect(() => {
    if (photoUrl) setIsLoading(false);
  }, [photoUrl]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      {photo && photoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <SkeletonLoader />
              </div>
            )}
            <img
              src={photoUrl}
              alt={photo.filename}
              onLoad={() => setIsLoading(false)}
              className="w-full h-full object-contain rounded-xl"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 hover:bg-black/80 transition-all text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-2 rounded-lg text-sm">
              {photo.filename}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface PhotoItemProps {
  photo: Photo;
  photoIndex: number;
  onPhotoClick: (photo: Photo) => void;
}

function PhotoItem({
  photo,
  photoIndex,
  onPhotoClick,
}: PhotoItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: "200px" });

  const isLarge = photoIndex % 5 === 4 || photoIndex % 8 === 0;
  const isMedium = photoIndex % 3 === 2;

  useEffect(() => {
    if (photoUrl) return;

    if (!isInView) return;

    if (photo.thumbUrl) {
      setPhotoUrl(photo.thumbUrl);
    }
  }, [isInView, photo.thumbUrl, photoUrl]);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: photoIndex * 0.02,
      }}
      onClick={() => onPhotoClick(photo)}
      className={`rounded-lg overflow-hidden border border-white/10 hover:border-cyber-blue/50 transition-all duration-300 group cursor-pointer ${
        isLarge ? "md:col-span-2 md:row-span-2" : ""
      } ${isMedium && !isLarge ? "md:col-span-1 md:row-span-1" : ""}`}
    >
      <div className="relative w-full h-full overflow-hidden bg-background/30">
        {/* Skeleton placeholder */}
        {!isLoaded && <SkeletonLoader />}

        {/* Actual image uses the generated thumbnail only. */}
        <img
          ref={imgRef}
          src={photoUrl ?? photo.thumbUrl ?? undefined}
          alt={`${photo.filename}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          decoding="async"
        />

        {/* Info overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-3 text-white">
            <p className="text-xs font-medium truncate">{photo.filename}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PhotoGrid({
  photos,
  meetupNumber,
}: {
  photos: Photo[];
  meetupNumber: number;
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "100px" });

  if (!isInView) {
    // Don't render grid until it comes into view to save resources
    return <div ref={gridRef} className="h-48" />;
  }

  return (
    <>
      <div
        ref={gridRef}
        className="grid gap-4 auto-rows-[200px] md:auto-rows-[240px]"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gridAutoFlow: "dense",
          contain: "layout style paint",
        }}
      >
        {photos.map((photo, photoIndex) => (
          <PhotoItem
            key={photo.key}
            photo={photo}
            photoIndex={photoIndex}
            onPhotoClick={setSelectedPhoto}
          />
        ))}
      </div>
      <ImageModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </>
  );
}

export default function PhotosSection() {
  const [loadedMeetupsCount, setLoadedMeetupsCount] = useState(1); // Keep the first paint small

  // Extract and group images by meetup number
  const photosByMeetup = useMemo(() => {
    const grouped: Record<number, Photo[]> = {};

    Object.entries(meetupThumbModules).forEach(([path, url]) => {
      const parts = path.split("/");
      const folderName = parts[parts.length - 3];
      const filename = parts[parts.length - 1];
      const numberMatch = folderName.match(/(\d+)/);
      const meetupNumber = numberMatch ? parseInt(numberMatch[1]) : 0;
      if (!grouped[meetupNumber]) {
        grouped[meetupNumber] = [];
      }

      const thumbUrl = typeof url === "string" ? url : (url as { default?: string })?.default ?? "";

      grouped[meetupNumber].push({
        key: path,
        filename,
        meetupNumber,
        thumbUrl,
      });
    });

    // Sort by meetup number descending and sort images within each meetup
    return Object.entries(grouped)
      .sort(([numA], [numB]) => parseInt(numB) - parseInt(numA))
      .map(([, photos]) => {
        return photos.sort((a, b) => a.filename.localeCompare(b.filename));
      });
  }, []);

  if (photosByMeetup.length === 0) {
    return null;
  }

  const visibleMeetups = photosByMeetup.slice(0, loadedMeetupsCount);
  const hasMore = loadedMeetupsCount < photosByMeetup.length;

  return (
    <section id="photos" className="py-24">
      <div className="section-container">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="mono-tag text-cyber-blue">03 — Gallery</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              Meetup <span className="gradient-text">Photos</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              A visual collection of all our BTU Tech Hub meetups, organized by event number.
            </p>
          </div>
        </FadeIn>

        {/* Grid of meetup photo clusters */}
        <div className="space-y-12">
          {visibleMeetups.map((photos, groupIndex) => {
            const meetupNumber = photos[0]?.meetupNumber;
            if (!meetupNumber) return null;

            return (
              <FadeIn key={`meetup-${meetupNumber}`} delay={groupIndex * 0.05}>
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
                    <h3 className="text-lg font-semibold text-cyber-blue">
                      Meetup #{meetupNumber}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      ({photos.length} photo{photos.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <PhotoGrid photos={photos} meetupNumber={meetupNumber} />
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() =>
                setLoadedMeetupsCount((prev) =>
                  Math.min(prev + 3, photosByMeetup.length)
                )
              }
              className="px-6 py-3 rounded-lg btn-cyber text-sm font-semibold"
            >
              Load More Meetups ({photosByMeetup.length - loadedMeetupsCount}{" "}
              remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
