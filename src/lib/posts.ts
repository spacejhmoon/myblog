import { supabase } from "@/lib/supabase"
import type { PostInsert } from "@/types/database"

export async function createPost(post: PostInsert) {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: post.user_id,
      title: post.title.trim(),
      content: post.content,
      tags: post.tags,
      is_public: post.is_public,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single()

  if (error) throw error
  return data.id as string
}
