import type { Book } from "@/types/book"


const isClient = typeof window !== "undefined"


export const getLocalBooks = (): Book[] => {
  if (!isClient) return []
  const storedBooks = localStorage.getItem("books")
  return storedBooks ? JSON.parse(storedBooks) : []
}


export const saveLocalBooks = (books: Book[]) => {
  if (!isClient) return
  localStorage.setItem("books", JSON.stringify(books))
}


export const addLocalBook = (book: Book): Book => {
  const books = getLocalBooks()
  const newBook = {
    ...book,
    id: books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1,
  }
  books.push(newBook)
  saveLocalBooks(books)
  return newBook
}

export const updateLocalBook = (book: Book): Book | null => {
  const books = getLocalBooks()
  const index = books.findIndex((b) => b.id === book.id)
  if (index === -1) return null
  books[index] = book
  saveLocalBooks(books)
  return book
}

export const deleteLocalBook = (id: number): boolean => {
  const books = getLocalBooks()
  const filteredBooks = books.filter((b) => b.id !== id)
  if (filteredBooks.length === books.length) return false
  saveLocalBooks(filteredBooks)
  return true
}

