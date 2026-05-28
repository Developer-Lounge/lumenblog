import { Clock3, UserCircle2 } from 'lucide-react'

function formatDate(value) {
  if (!value) return 'Just now'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function PostCard({ post }) {
  return (
    <article className="glass-card grid gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="post-title">{post.title}</h3>
          <div className="post-meta mt-2">
            <span className="inline-flex items-center gap-2">
              <UserCircle2 className="h-4 w-4 text-emerald-300" />
              <span className="truncate">{post.author || 'Anonymous'}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-amber-300" />
              <span>{formatDate(post.createdAt)}</span>
            </span>
          </div>
        </div>

        <span className="badge shrink-0">Post</span>
      </div>

      <p className="text-sm leading-7 text-slate-200/90">{post.content}</p>
    </article>
  )
}

export default PostCard
