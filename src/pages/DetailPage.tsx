import { useParams, Link } from "react-router-dom"

export function DetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 목록으로
      </Link>
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          글 제목 (ID: {id ?? "—"})
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          작성일 · 작성자
        </p>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Supabase 연동 후 해당 ID의 게시글 내용을 불러와 표시할 수 있습니다.
        </p>
      </div>
    </article>
  )
}
