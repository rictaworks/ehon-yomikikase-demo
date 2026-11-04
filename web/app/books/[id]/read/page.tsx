import { Suspense } from "react"
import { notFound } from "next/navigation"
import ReadView from "@/components/ReadView"
import { MASTER_BOOK_IDS } from "@/config/books"

// output: "export" のため、動的ルートは事前生成する ID を明示する。
export function generateStaticParams() {
  return MASTER_BOOK_IDS.map((id) => ({ id: String(id) }))
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function ReadPage({ params }: Props) {
  const { id } = await params
  const bookId = Number(id)
  if (!Number.isSafeInteger(bookId)) {
    notFound()
  }
  return (
    <Suspense fallback={null}>
      <ReadView bookId={bookId} />
    </Suspense>
  )
}
