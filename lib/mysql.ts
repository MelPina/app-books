import mysql from "mysql2/promise"
import { dbConfig } from "./db-config"
import type { Book } from "@/types/book"


let pool: mysql.Pool | null = null

export const getPool = async () => {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })
    } catch (error) {
      console.error("Error al crear el pool de conexiones MySQL:", error)
      throw error
    }
  }
  return pool
}

// Función para ejecutar consultas SQL
export const query = async (sql: string, params: any[] = []) => {
  try {
    const pool = await getPool()
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    console.error("Error al ejecutar consulta MySQL:", error)
    throw error
  }
}

export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const results = (await query("SELECT * FROM books ORDER BY id DESC")) as any[]
    
    return results.map((book) => ({
      id: book.id,
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publicationYear: book.publication_year || "",
      description: book.description || "",
    }))
  } catch (error) {
    console.error("Error al obtener libros:", error)
    throw error
  }
}

export const getBookById = async (id: number): Promise<Book | null> => {
  try {
    const books = (await query("SELECT * FROM books WHERE id = ?", [id])) as any[]
    if (books.length === 0) return null

    const book = books[0]
    return {
      id: book.id,
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publicationYear: book.publication_year || "",
      description: book.description || "",
    }
  } catch (error) {
    console.error("Error al obtener libro por ID:", error)
    throw error
  }
}

// Función para añadir un nuevo libro
export const addBook = async (book: Omit<Book, "id">): Promise<Book> => {
  try {
    const result = (await query(
      "INSERT INTO books (isbn, title, author, publication_year, description) VALUES (?, ?, ?, ?, ?)",
      [book.isbn, book.title, book.author, book.publicationYear, book.description],
    )) as mysql.ResultSetHeader

    const newBook = await getBookById(result.insertId)
    if (!newBook) throw new Error("No se pudo obtener el libro recién creado")
    return newBook
  } catch (error) {
    console.error("Error al añadir libro:", error)
    throw error
  }
}

// Función para actualizar un libro
export const updateBook = async (id: number, book: Omit<Book, "id">): Promise<Book | null> => {
  try {
    const result = (await query(
      "UPDATE books SET isbn = ?, title = ?, author = ?, publication_year = ?, description = ? WHERE id = ?",
      [book.isbn, book.title, book.author, book.publicationYear, book.description, id],
    )) as mysql.ResultSetHeader

    if (result.affectedRows === 0) return null

    return await getBookById(id)
  } catch (error) {
    console.error("Error al actualizar libro:", error)
    throw error
  }
}

// Función para eliminar un libro
export const deleteBook = async (id: number): Promise<boolean> => {
  try {
    const result = (await query("DELETE FROM books WHERE id = ?", [id])) as mysql.ResultSetHeader
    return result.affectedRows > 0
  } catch (error) {
    console.error("Error al eliminar libro:", error)
    throw error
  }
}

