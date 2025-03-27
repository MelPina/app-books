"use client"

import { useState, useEffect } from "react"
import { BookForm } from "./book-form"
import { BookList } from "./book-list"
import { SearchBooks } from "./search-books"
import type { Book } from "@/types/book"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BookManagement() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/books")
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch books")
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      setError("Failed to connect to the server. Using local storage for data persistence.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBook = async (book: Book) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      })

      if (response.ok) {
        fetchBooks()
        return true
      }

      const errorData = await response.json()
      setError(errorData.error || "Failed to add book")
      return false
    } catch (error) {
      console.error("Error adding book:", error)
      setError("Failed to connect to the server. Using local storage for data persistence.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateBook = async (book: Book) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      })

      if (response.ok) {
        fetchBooks()
        setSelectedBook(null)
        return true
      }

      const errorData = await response.json()
      setError(errorData.error || "Failed to update book")
      return false
    } catch (error) {
      console.error("Error updating book:", error)
      setError("Failed to connect to the server. Using local storage for data persistence.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBook = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchBooks()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to delete book")
      }
    } catch (error) {
      console.error("Error deleting book:", error)
      setError("Failed to connect to the server. Using local storage for data persistence.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditBook = (book: Book) => {
    setSelectedBook(book)
  }

  const handleCancelEdit = () => {
    setSelectedBook(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <BookForm
          onSubmit={selectedBook ? handleUpdateBook : handleAddBook}
          initialData={selectedBook}
          onCancel={handleCancelEdit}
          isLoading={isLoading}
        />
        <div className="mt-8">
          <SearchBooks />
        </div>
      </div>
      <div>
        <BookList books={books} onEdit={handleEditBook} onDelete={handleDeleteBook} isLoading={isLoading} />
      </div>
    </div>
  )
}

