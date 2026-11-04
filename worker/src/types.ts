export interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  ageMin: number;
  ageMax: number;
  categoryId: number;
  totalPages: number;
  categoryName?: string;
}

export interface Page {
  id: number;
  bookId: number;
  pageNumber: number;
  imagePath: string;
  textContent: string;
}

export interface Category {
  id: number;
  name: string;
  priority: number;
}

export interface BookFilter {
  categoryId?: number;
  ageMin?: number;
  ageMax?: number;
}
