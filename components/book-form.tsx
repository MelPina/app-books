"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { Book } from "@/types/book"

interface BookFormProps {
  onSubmit: (book: Book) => Promise<boolean>
  initialData: Book | null
  onCancel: () => void
  isLoading: boolean
}

export function BookForm({ onSubmit, initialData, onCancel, isLoading }: BookFormProps) {
  const [formData, setFormData] = useState<Book>({
    id: 0,
    isbn: "",
    title: "",
    author: "",
    publicationYear: "",
    description: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        id: 0,
        isbn: "",
        title: "",
        author: "",
        publicationYear: "",
        description: "",
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required"
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.author.trim()) newErrors.author = "Author is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const success = await onSubmit(formData)

    if (success) {
      setFormData({
        id: 0,
        isbn: "",
        title: "",
        author: "",
        publicationYear: "",
        description: "",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Editar Libro" : "Registrar Libro"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Introduce el ISBN"
              className={errors.isbn ? "border-red-500" : ""}
            />
            {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Introduce el título del libro"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Introduce el nombre del autor"
              className={errors.author ? "border-red-500" : ""}
            />
            {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicationYear">Año de Publicación</Label>
            <Input
              id="publicationYear"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              placeholder="Introduce el año de publicación"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descricción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Introduce la descripción del libro"
              rows={4}
            />
          </div>
          <br />
        </CardContent>
        <CardFooter className="flex justify-center">
          {initialData && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : initialData ? "Actualizar Libro" : "Registrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

