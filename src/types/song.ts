export interface Song {
  id: string;
  trackName: string;
  artistName: string;
  albumName: string;
  genre: string;
  durationMs: number;
  releaseDate: string;
  artworkUrl: string;
  previewUrl: string;
  price: number;
  rating: number;
  playCount: number;
  description: string;
  lyrics: string;
  isFavorite: boolean;
  isCustom?: boolean;
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'name-asc'
  | 'name-desc'
  | 'duration-asc'
  | 'duration-desc'
  | 'rating-desc';

export interface FilterOptions {
  searchTerm: string;
  genre: string;
  durationRange: 'all' | 'short' | 'medium' | 'long';
  dataSource: 'all' | 'custom' | 'system';
  sortBy: SortOption;
}
