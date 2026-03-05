import { supabase } from "@/lib/supabase"
import type { ProfileInsert } from "@/types/database"

/** 회원가입 직후 프로필 행 생성/갱신 (트리거 미적용 시 대비) */
export async function upsertProfile(profile: ProfileInsert) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: profile.id,
      email: profile.email,
      nickname: profile.nickname,
      bio: profile.bio ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )
  if (error) throw error
}
