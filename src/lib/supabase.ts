import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? "").trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim()

const isPlaceholderUrl = (url: string) =>
  !url || url.includes("your-project") || url.includes("your-project-id")
const isPlaceholderKey = (key: string) =>
  !key || key === "your-anon-key" || key.startsWith("your-")

export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl.startsWith("http") &&
    !isPlaceholderUrl(supabaseUrl) &&
    !!supabaseAnonKey &&
    !isPlaceholderKey(supabaseAnonKey)
  )
}

/** 로그인 상태 유지 체크 시 localStorage, 미체크 시 sessionStorage 사용 */
const REMEMBER_STORAGE_KEY = "myblog-remember"

function getAuthStorage() {
  if (typeof localStorage === "undefined") return localStorage
  return localStorage.getItem(REMEMBER_STORAGE_KEY) === "false"
    ? sessionStorage
    : localStorage
}

const customStorage = {
  getItem(key: string) {
    if (key === REMEMBER_STORAGE_KEY)
      return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null
    if (key.startsWith("sb-"))
      return typeof localStorage !== "undefined" ? getAuthStorage().getItem(key) : null
    return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null
  },
  setItem(key: string, value: string) {
    if (typeof localStorage === "undefined") return
    if (key === REMEMBER_STORAGE_KEY) {
      localStorage.setItem(key, value)
      return
    }
    if (key.startsWith("sb-")) {
      getAuthStorage().setItem(key, value)
      return
    }
    localStorage.setItem(key, value)
  },
  removeItem(key: string) {
    if (typeof localStorage === "undefined") return
    if (key.startsWith("sb-")) {
      sessionStorage.removeItem(key)
      localStorage.removeItem(key)
      return
    }
    localStorage.removeItem(key)
  },
}

/** 로그인 전에 호출하여 '로그인 상태 유지' 선택을 반영 */
export function setRememberMe(remember: boolean) {
  if (typeof localStorage === "undefined") return
  localStorage.setItem(REMEMBER_STORAGE_KEY, remember ? "true" : "false")
}

if (!isSupabaseConfigured()) {
  console.warn(
    "[myblog] Supabase가 설정되지 않았습니다. .env 파일에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 설정하세요. (.env.example 참고)"
  )
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: customStorage },
})
