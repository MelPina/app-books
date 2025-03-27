import { NextResponse } from "next/server"
import type { Book } from "@/types/book"
import { getLocalBooks, addLocalBook } from "@/lib/db"

// GET all books
export async function GET() {
  try {
    // Intentar usar MySQL si está disponible
    try {
      const { getAllBooks } = await import("@/lib/mysql")
      const books = await getAllBooks()
      return NextResponse.json(books)
    } catch (dbError) {
      console.log("Base de datos no disponible, usando localStorage como respaldo", dbError)
      // Usar localStorage si la base de datos no está disponible
      const books = getLocalBooks()
      return NextResponse.json(books)
    }
  } catch (error) {
    console.error("Error al obtener libros:", error)
    return NextResponse.json({ error: "Error al obtener libros" }, { status: 500 })
  }
}

// POST a new book
export async function POST(request: Request) {
  try {
    const book: Book = await request.json()

    // Validar campos requeridos
    if (!book.isbn || !book.title || !book.author) {
      return NextResponse.json({ error: "ISBN, título y autor son campos obligatorios" }, { status: 400 })
    }

    // Intentar usar MySQL si está disponible
    try {
      const { addBook } = await import("@/lib/mysql")
      const newBook = await addBook(book)
      return NextResponse.json(newBook, { status: 201 })
    } catch (dbError) {
      console.log("Base de datos no disponible, usando localStorage como respaldo", dbError)
      // Usar localStorage si la base de datos no está disponible
      const newBook = addLocalBook(book)
      return NextResponse.json(newBook, { status: 201 })
    }
  } catch (error) {
    console.error("Error al añadir libro:", error)
    return NextResponse.json({ error: "Error al añadir libro" }, { status: 500 })
  }
}

