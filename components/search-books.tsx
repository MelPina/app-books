"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { BookSearchResult } from "@/types/book"

export function SearchBooks() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<BookSearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchTerm.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/books/search?title=${encodeURIComponent(searchTerm)}`)

      if (!response.ok) {
        throw new Error("Failed to search books")
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error searching books:", error)
      setError("An error occurred while searching for books. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar libros en Google</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ingrese el título del libro"
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {searchResults && searchResults.items && searchResults.items.length > 0 && (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium">Resultados de la búsqueda:</h3>
              <div className="space-y-3">
                {searchResults.items.slice(0, 5).map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {item.volumeInfo.imageLinks?.thumbnail && (
                          <img
                            src={item.volumeInfo.imageLinks.thumbnail || "/placeholder.svg"}
                            alt={item.volumeInfo.title}
                            className="w-16 h-auto object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{item.volumeInfo.title}</h4>
                          {item.volumeInfo.authors && (
                            <p className="text-sm text-muted-foreground">By {item.volumeInfo.authors.join(", ")}</p>
                          )}
                          {item.volumeInfo.publishedDate && (
                            <p className="text-sm text-muted-foreground">
                              Publicado: {item.volumeInfo.publishedDate.substring(0, 4)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {searchResults && (!searchResults.items || searchResults.items.length === 0) && (
            <p className="text-center py-4 text-muted-foreground">No books found matching your search.</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

