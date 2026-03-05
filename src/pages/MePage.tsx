import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function MePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="mx-auto max-w-sm space-y-6 pt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">내 페이지</h1>
        <p className="text-muted-foreground text-sm">
          로그인한 사용자만 이용할 수 있습니다.
        </p>
        <Button asChild>
          <Link to="/login">로그인</Link>
        </Button>
      </div>
    )
  }

  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : "?"

  return (
    <div className="mx-auto max-w-2xl space-y-8 pt-8">
      <h1 className="text-2xl font-bold tracking-tight">내 페이지</h1>
      <section className="flex items-center gap-4 rounded-lg border bg-card p-6">
        <Avatar className="size-16">
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email ?? ""} />
          <AvatarFallback className="bg-primary/10 text-primary text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.email}</p>
          <p className="text-sm text-muted-foreground">
            가입일: {new Date(user.created_at).toLocaleDateString("ko-KR")}
          </p>
        </div>
      </section>
      <section className="rounded-lg border bg-card p-6">
        <h2 className="font-semibold mb-4">내가 쓴 글</h2>
        <p className="text-sm text-muted-foreground">
          Supabase 연동 후 여기에 작성한 글 목록을 표시할 수 있습니다.
        </p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/write">글쓰기</Link>
        </Button>
      </section>
    </div>
  )
}
