export interface Book {
  id: number
  isbn: string
  title: string
  author: string
  publicationYear: string
  description: string
}

export interface BookSearchResult {
  items?: {
    id: string
    volumeInfo: {
      title: string
      authors?: string[]
      publishedDate?: string
      description?: string
      imageLinks?: {
        thumbnail: string
      }
    }
  }[]
}

