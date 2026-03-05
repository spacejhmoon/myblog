import { Link, useNavigate } from "react-router-dom"
import { LogOut, PenSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "?"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link
          to="/"
          className="font-semibold text-lg text-foreground hover:opacity-80 transition-opacity"
        >
          myblog
        </Link>

        <nav className="flex items-center gap-2">
          {loading ? (
            <span className="text-sm text-muted-foreground">로딩 중...</span>
          ) : user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/write">
                  <PenSquare className="size-4" />
                  글쓰기
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("rounded-full")}
                    aria-label="프로필 메뉴"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email ?? ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/me" className="flex items-center gap-2 cursor-pointer">
                      <User className="size-4" />
                      내 페이지
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleSignOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">회원가입</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
