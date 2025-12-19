export interface Album {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumListItem extends Album {
  imageCount: number;
}

export interface AlbumImage {
  id: string;
  albumId: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  position: number;
  createdAt: string;
}

export interface AlbumWithImages extends Album {
  images: AlbumImage[];
}

