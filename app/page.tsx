import BookManagement from "@/components/book-management"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Sistema de gestión de libros</h1>
      <BookManagement />
    </main>

  )
}

