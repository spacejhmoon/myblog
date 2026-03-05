import { Link } from "react-router-dom"

export function MainPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">myblog</h1>
        <p className="text-muted-foreground mt-2">
          블로그 메인 페이지입니다. 글 목록이 여기에 표시됩니다.
        </p>
      </section>
      <section className="rounded-lg border bg-card p-6 text-card-foreground">
        <p className="text-sm text-muted-foreground">
          Supabase 연동 후 게시글 목록을 불러와 표시할 수 있습니다.
        </p>
        <Link
          to="/post/sample"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          샘플 상세 페이지 →
        </Link>
      </section>
    </div>
  )
}
