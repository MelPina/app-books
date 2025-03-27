import { NextResponse } from "next/server"
import type { Book } from "@/types/book"
import { getLocalBooks, updateLocalBook, deleteLocalBook } from "@/lib/db"

// GET a specific book by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Intentar usar MySQL si está disponible
    try {
      const { getBookById } = await import("@/lib/mysql")
      const book = await getBookById(id)

      if (!book) {
        return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
      }

      return NextResponse.json(book)
    } catch (dbError) {
      console.log("Base de datos no disponible, usando localStorage como respaldo", dbError)
      // Usar localStorage si la base de datos no está disponible
      const books = getLocalBooks()
      const book = books.find((b) => b.id === id)

      if (!book) {
        return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
      }

      return NextResponse.json(book)
    }
  } catch (error) {
    console.error("Error al obtener libro:", error)
    return NextResponse.json({ error: "Error al obtener libro" }, { status: 500 })
  }
}

// UPDATE a book
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const book: Book = await request.json()

    // Validar campos requeridos
    if (!book.isbn || !book.title || !book.author) {
      return NextResponse.json({ error: "ISBN, título y autor son campos obligatorios" }, { status: 400 })
    }

    // Intentar usar MySQL si está disponible
    try {
      const { updateBook } = await import("@/lib/mysql")
      const updatedBook = await updateBook(id, book)

      if (!updatedBook) {
        return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
      }

      return NextResponse.json(updatedBook)
    } catch (dbError) {
      console.log("Base de datos no disponible, usando localStorage como respaldo", dbError)
      // Usar localStorage si la base de datos no está disponible
      const updatedBook = updateLocalBook({ ...book, id })

      if (!updatedBook) {
        return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
      }

      return NextResponse.json(updatedBook)
    }
  } catch (error) {
    console.error("Error al actualizar libro:", error)
    return NextResponse.json({ error: "Error al actualizar libro" }, { status: 500 })
  }
}

// DELETE a book
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Intentar usar MySQL si está disponible
    try {
      const { deleteBook } = await import("@/lib/mysql")
      const deleted = await deleteBook(id)

      if (!deleted) {
        return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
      }

      return NextResponse.json({ message: "Libro eliminado correctamente" })
    } catch (dbError) {
      console.log("Base de datos no disponible, usando localStorage como respaldo", dbError)
      // Usar localStorage si la base de datos no está disponible
      const deleted = deleteLocalBook(id)

      if (!deleted) {
        return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
      }

      return NextResponse.json({ message: "Libro eliminado correctamente" })
    }
  } catch (error) {
    console.error("Error al eliminar libro:", error)
    return NextResponse.json({ error: "Error al eliminar libro" }, { status: 500 })
  }
}

