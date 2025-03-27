import mysql from "mysql2/promise";
import { dbConfig } from "./db-config";
import type { Book } from "@/types/book";

// Crear un pool de conexiones a MySQL
let pool: mysql.Pool | null = null;

// Función para obtener el pool de conexiones
export const getPool = async (): Promise<mysql.Pool> => {
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
      });
    } catch (error) {
      console.error("Error al crear el pool de conexiones MySQL:", error);
      throw error;
    }
  }
  return pool;
};

// Función para ejecutar consultas SQL
export const query = async <T = mysql.RowDataPacket[]>(sql: string, params: unknown[] = []): Promise<T> => {
  try {
    const pool = await getPool();
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(sql, params);
    return rows as T;
  } catch (error) {
    console.error("Error al ejecutar consulta MySQL:", error);
    throw error;
  }
};

// Función para obtener todos los libros
export const getAllBooks = async (): Promise<Book[]> => {
  return await query<Book[]>("SELECT * FROM books ORDER BY id DESC");
};

// Función para obtener un libro por ID
export const getBookById = async (id: number): Promise<Book | null> => {
  const books = await query<Book[]>("SELECT * FROM books WHERE id = ?", [id]);
  return books.length > 0 ? books[0] : null;
};

// Función para añadir un nuevo libro
export const addBook = async (book: Omit<Book, "id">): Promise<Book> => {
  const result = await query<mysql.ResultSetHeader>(
    "INSERT INTO books (isbn, title, author, publication_year, description) VALUES (?, ?, ?, ?, ?)",
    [book.isbn, book.title, book.author, book.publicationYear, book.description]
  );

  const newBook = await getBookById(result.insertId);
  if (!newBook) throw new Error("No se pudo obtener el libro recién creado");
  return newBook;
};

// Función para actualizar un libro
export const updateBook = async (id: number, book: Omit<Book, "id">): Promise<Book | null> => {
  const result = await query<mysql.ResultSetHeader>(
    "UPDATE books SET isbn = ?, title = ?, author = ?, publication_year = ?, description = ? WHERE id = ?",
    [book.isbn, book.title, book.author, book.publicationYear, book.description, id]
  );

  if (result.affectedRows === 0) return null;

  return await getBookById(id);
};

// Función para eliminar un libro
export const deleteBook = async (id: number): Promise<boolean> => {
  const result = await query<mysql.ResultSetHeader>("DELETE FROM books WHERE id = ?", [id]);
  return result.affectedRows > 0;
};
