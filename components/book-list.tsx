"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Book } from "@/types/book"
import { Pencil, Trash2 } from "lucide-react"

interface BookListProps {
  books: Book[]
  onEdit: (book: Book) => void
  onDelete: (id: number) => void
  isLoading: boolean
}

export function BookList({ books, onEdit, onDelete, isLoading }: BookListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Libros</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : books.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No se encontraron libros. Añade un nuevo libro para empezar.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Año de Publicación</TableHead>
                  <TableHead className="text-right">Accciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.publicationYear}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => onEdit(book)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(book.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

