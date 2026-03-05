import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { upsertProfile } from "@/lib/profiles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const BIO_MAX_LENGTH = 200

export function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [nickname, setNickname] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.")
      return
    }
    if (password.length < 6) {
      toast.error("비밀번호는 6자 이상이어야 합니다.")
      return
    }
    if (bio.length > BIO_MAX_LENGTH) {
      toast.error(`자기소개는 최대 ${BIO_MAX_LENGTH}자까지 입력할 수 있습니다.`)
      return
    }

    if (!isSupabaseConfigured()) {
      toast.error(
        "Supabase가 설정되지 않았습니다. .env에 본인 프로젝트의 URL과 anon key를 넣어 주세요. (your-project, your-anon-key는 예시 값이라 사용할 수 없습니다.)"
      )
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname, bio: bio.trim() || null },
        },
      })

      if (signUpError) {
        const msg = (signUpError.message ?? "").toLowerCase()
        const err = signUpError as { status?: number; code?: string }
        const status = err.status
        const code = (err.code ?? "").toLowerCase()

        if (
          msg.includes("already registered") ||
          msg.includes("already exists") ||
          msg.includes("user already registered")
        ) {
          toast.error("이미 가입된 이메일입니다.")
          return
        }

        if (status === 400) {
          if (
            (msg.includes("signup") && msg.includes("disabled")) ||
            msg.includes("signups not allowed") ||
            msg.includes("email provider")
          ) {
            toast.error(
              "이메일 회원가입이 비활성화되어 있습니다. Supabase 대시보드 → Authentication → Providers → Email 에서 'Enable Email provider'를 켜 주세요."
            )
          } else {
            toast.error(
              signUpError.message ||
                "요청이 거부되었습니다(400). Supabase 대시보드 → Authentication → Providers → Email 에서 이메일 가입이 활성화돼 있는지 확인해 주세요."
            )
          }
          return
        }

        if (
          status === 429 ||
          code.includes("over_email_send_rate_limit") ||
          msg.includes("rate limit") ||
          msg.includes("email rate limit")
        ) {
          toast.error(
            "이메일 발송 한도를 초과했습니다. 잠시 후 다시 시도하거나, Supabase 대시보드 → Authentication → Providers → Email 에서 'Confirm email'을 끄면 인증 메일 없이 가입할 수 있습니다."
          )
          return
        }

        toast.error(signUpError.message || "회원가입에 실패했습니다.")
        return
      }

      if (data.user) {
        try {
          await upsertProfile({
            id: data.user.id,
            email: data.user.email ?? email,
            nickname,
            bio: bio.trim() || null,
          })
        } catch {
          // 트리거가 프로필을 이미 만들었을 수 있음 → 무시
        }
      }

      toast.success("회원가입이 완료되었습니다. 로그인해 주세요.")
      navigate("/login")
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        toast.error(
          "서버에 연결할 수 없습니다. .env의 Supabase URL·키와 인터넷 연결을 확인해 주세요."
        )
      } else {
        toast.error(
          err instanceof Error ? err.message : "회원가입에 실패했습니다."
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>
            이메일, 비밀번호, 닉네임을 입력하세요.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일 주소</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
              <Input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">
                자기소개 <span className="text-muted-foreground">(선택, 최대 {BIO_MAX_LENGTH}자)</span>
              </Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX_LENGTH))}
                placeholder="자기소개를 입력하세요"
                maxLength={BIO_MAX_LENGTH}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/{BIO_MAX_LENGTH}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "가입 중..." : "회원가입"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                로그인
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
