import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get("title")

    if (!title) {
      return NextResponse.json({ error: "Title parameter is required" }, { status: 400 })
    }

    // Call the external Google Books API
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`)

    if (!response.ok) {
      throw new Error("Failed to fetch data from Google Books API")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to search books" }, { status: 500 })
  }
}

