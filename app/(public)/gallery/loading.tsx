export default function GalleryLoading() {
  return (
    <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-8">
      <div className="h-10 bg-[var(--color-bg-secondary)] rounded w-48 mb-8 animate-pulse" />
      
      {/* Masonry 레이아웃 스켈레톤 */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div
            key={i}
            className="mb-4 break-inside-avoid"
          >
            <div
              className={`h-${Math.floor(Math.random() * 40) + 20} bg-[var(--color-bg-secondary)] rounded-lg animate-pulse`}
              style={{
                height: `${Math.floor(Math.random() * 200) + 150}px`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

