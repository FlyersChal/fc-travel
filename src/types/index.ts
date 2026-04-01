export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  content_type: "markdown" | "html" | "mdx";
  excerpt: string | null;
  cover_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  no_index: boolean;
  published: boolean;
  scheduled_at: string | null;
  category_id: string | null;
  source: "web" | "api" | "cron";
  tags: string[];
  language: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key_hash: string;
  admin_id: string;
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface PostImage {
  id: string;
  post_id: string;
  storage_path: string;
  alt_text: string | null;
  created_at: string;
}
