import { AlbumForm } from '@/components/admin/AlbumForm';

export default function NewAlbumPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        새 앨범 만들기
      </h1>
      <AlbumForm />
    </div>
  );
}

