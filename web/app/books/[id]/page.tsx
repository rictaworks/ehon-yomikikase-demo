import { notFound } from "next/navigation"
import BookDetailView from "@/components/BookDetailView"
import { MASTER_BOOK_IDS } from "@/config/books"

// output: "export" のため、動的ルートは事前生成する ID を明示する。
export function generateStaticParams() {
  return MASTER_BOOK_IDS.map((id) => ({ id: String(id) }))
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params
  const bookId = Number(id)
  if (!Number.isSafeInteger(bookId)) {
    notFound()
  }
  return <BookDetailView bookId={bookId} />
}
