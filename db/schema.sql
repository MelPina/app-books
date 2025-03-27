-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS book_management;

-- Usar la base de datos
USE book_management;

-- Crear tabla de libros
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  publication_year VARCHAR(4),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear índice en ISBN para búsquedas más rápidas
CREATE INDEX idx_books_isbn ON books(isbn);

-- Crear un procedimiento almacenado para obtener libros por autor
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS get_books_by_author(IN author_name VARCHAR(255))
BEGIN
  SELECT * FROM books WHERE author LIKE CONCAT('%', author_name, '%');
END //
DELIMITER ;

-- Crear un trigger para actualizar la fecha de modificación
DELIMITER //
CREATE TRIGGER IF NOT EXISTS before_book_update
BEFORE UPDATE ON books
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END //
DELIMITER ;

-- Crear un trigger para registrar eliminaciones de libros
DELIMITER //
CREATE TABLE IF NOT EXISTS books_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  isbn VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  action VARCHAR(10) NOT NULL,
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER IF NOT EXISTS after_book_delete
AFTER DELETE ON books
FOR EACH ROW
BEGIN
  INSERT INTO books_audit (book_id, isbn, title, action)
  VALUES (OLD.id, OLD.isbn, OLD.title, 'DELETE');
END //
DELIMITER ;

