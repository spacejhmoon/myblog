export type Profile = {
  id: string
  email: string
  nickname: string
  bio: string | null
  created_at: string
  updated_at: string
}

export type ProfileInsert = {
  id: string
  email: string
  nickname: string
  bio?: string | null
}

export type Post = {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  is_public: boolean
  created_at: string
  updated_at: string
}

export type PostInsert = {
  user_id: string
  title: string
  content: string
  tags: string[]
  is_public: boolean
}
