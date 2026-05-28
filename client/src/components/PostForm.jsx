import { useState } from 'react'
import { SendHorizontal, Type, AlignLeft } from 'lucide-react'

const initialForm = {
  title: '',
  content: '',
  author: '',
}

function PostForm({ onSubmitPost }) {
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedbackMessage('')

    const result = await onSubmitPost({
      title: formData.title.trim(),
      content: formData.content.trim(),
      author: formData.author.trim(),
    })

    if (result?.ok) {
      setFormData(initialForm)
      setFeedbackMessage('Post published successfully.')
    } else {
      setFeedbackMessage(result?.message || 'Could not publish the post.')
    }

    setIsSubmitting(false)
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="post-title">Title</label>
        <div className="relative">
          <Type className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="post-title"
            className="input pl-11"
            type="text"
            name="title"
            placeholder="A sharp headline for your post"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="post-content">Content</label>
        <div className="relative">
          <AlignLeft className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
          <textarea
            id="post-content"
            className="textarea pl-11"
            name="content"
            placeholder="Write something thoughtful, useful, or bold."
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="post-author">Author</label>
        <input
          id="post-author"
          className="input"
          type="text"
          name="author"
          placeholder="Optional display name"
          value={formData.author}
          onChange={handleChange}
        />
      </div>

      {feedbackMessage ? <div className="status-success">{feedbackMessage}</div> : null}

      <button type="submit" className="button-primary w-full" disabled={isSubmitting}>
        <SendHorizontal className="h-4 w-4" />
        {isSubmitting ? 'Publishing…' : 'Publish post'}
      </button>
    </form>
  )
}

export default PostForm
