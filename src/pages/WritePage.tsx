import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { createPost } from "@/lib/posts"
import { isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const MAX_TAGS = 5

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_TAGS)
}

export function WritePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <div className="mx-auto max-w-sm space-y-6 pt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">글쓰기</h1>
        <p className="text-muted-foreground text-sm">
          로그인한 사용자만 글을 작성할 수 있습니다.
        </p>
        <Button asChild>
          <Link to="/login">로그인</Link>
        </Button>
      </div>
    )
  }

  const tags = parseTags(tagsInput)
  const canPublish = title.trim().length > 0

  const handlePublish = async () => {
    if (!canPublish) {
      toast.error("제목을 입력해 주세요.")
      return
    }
    if (!isSupabaseConfigured()) {
      toast.error("Supabase가 설정되지 않았습니다. .env를 확인해 주세요.")
      return
    }

    setLoading(true)
    try {
      const postId = await createPost({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        tags,
        is_public: isPublic,
      })
      toast.success("글이 발행되었습니다.")
      navigate(`/post/${postId}`)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "발행에 실패했습니다. 다시 시도해 주세요."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (window.confirm("작성을 취소할까요? 입력한 내용이 사라집니다.")) {
        navigate("/")
      }
    } else {
      navigate("/")
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      {/* 상단 버튼 */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">글쓰기</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            취소
          </Button>
          <Button onClick={handlePublish} disabled={loading || !canPublish}>
            {loading ? "발행 중..." : "발행 하기"}
          </Button>
        </div>
      </div>

      {/* 설정: 공개/비공개 */}
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <div>
          <Label htmlFor="visibility" className="text-base font-medium">
            공개 설정
          </Label>
          <p className="text-sm text-muted-foreground">
            비공개로 하면 본인만 볼 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isPublic ? "공개" : "비공개"}
          </span>
          <Switch
            id="visibility"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>
      </div>

      {/* 제목 */}
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="text-lg"
          maxLength={200}
        />
      </div>

      {/* 내용 에디터 */}
      <div className="space-y-2">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          className="min-h-[320px] resize-y font-mono text-sm"
        />
      </div>

      {/* 태그 (쉼표로 구분, 최대 5개) */}
      <div className="space-y-2">
        <Label htmlFor="tags">
          태그 <span className="text-muted-foreground">(쉼표로 구분, 최대 {MAX_TAGS}개)</span>
        </Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="예: 일상, 개발, 리뷰"
        />
        {tags.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {tags.length}/{MAX_TAGS}개: {tags.join(", ")}
          </p>
        )}
      </div>
    </div>
  )
}
