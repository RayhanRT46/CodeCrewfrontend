export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  coverImageUrl: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}