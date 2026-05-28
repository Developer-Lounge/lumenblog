import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Sparkles, RefreshCw, PenSquare, Flame } from 'lucide-react'
import Header from './components/Header'
import Login from './components/Login'
import Register from './components/Register'
import PostCard from './components/PostCard'
import PostForm from './components/PostForm'

const TOKEN_KEY = 'lumenblog_token'
const USER_KEY = 'lumenblog_user'

function readStoredUser() {
  try {
    const value = localStorage.getItem(USER_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(() => readStoredUser())
  const [posts, setPosts] = useState([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isAuthenticated = Boolean(token)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoadingPosts(true)
        const response = await axios.get('/api/posts')
        setPosts(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || 'Failed to load the feed. Please try again.',
        )
      } finally {
        setIsLoadingPosts(false)
      }
    }

    loadPosts()
  }, [])

  const session = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
    }),
    [token, user, isAuthenticated],
  )

  const saveSession = (nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
  }

  const clearSession = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const refreshPosts = async () => {
    try {
      setErrorMessage('')
      const response = await axios.get('/api/posts')
      setPosts(Array.isArray(response.data) ? response.data : [])
      setStatusMessage('Feed refreshed.')
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Could not refresh the feed right now.',
      )
    }
  }

  const handleCreatePost = async (payload) => {
    try {
      setErrorMessage('')
      const response = await axios.post('/api/posts', payload, {
        headers: session.token
          ? {
              Authorization: `Bearer ${session.token}`,
            }
          : undefined,
      })

      setPosts((currentPosts) => [response.data, ...currentPosts])
      setStatusMessage('Post published successfully.')
      return { ok: true }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Could not publish the post right now.'
      setErrorMessage(message)
      return { ok: false, message }
    }
  }

  const handleAuthSuccess = (nextToken, nextUser, navigate) => {
    saveSession(nextToken, nextUser)
    navigate('/')
  }

  return (
    <BrowserRouter>
      <AppRoutes
        session={session}
        posts={posts}
        isLoadingPosts={isLoadingPosts}
        statusMessage={statusMessage}
        errorMessage={errorMessage}
        onCreatePost={handleCreatePost}
        onRefreshPosts={refreshPosts}
        onClearStatus={() => setStatusMessage('')}
        onSignOut={() => {
          clearSession()
          setStatusMessage('You signed out.')
        }}
        onAuthSuccess={handleAuthSuccess}
      />
    </BrowserRouter>
  )
}

function AppRoutes(props) {
  const navigate = useNavigate()

  const handleAuthSuccess = (token, user) => {
    props.onAuthSuccess(token, user, navigate)
  }

  return (
    <div className="app-shell glass-shell">
      <Header
        user={props.session.user}
        isAuthenticated={props.session.isAuthenticated}
        onSignOut={props.onSignOut}
      />

      <main className="glass-container flex-1 pb-8">
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth isAuthenticated={props.session.isAuthenticated}>
                <DashboardPage
                  user={props.session.user}
                  posts={props.posts}
                  isLoadingPosts={props.isLoadingPosts}
                  statusMessage={props.statusMessage}
                  errorMessage={props.errorMessage}
                  onCreatePost={props.onCreatePost}
                  onRefreshPosts={props.onRefreshPosts}
                  onClearStatus={props.onClearStatus}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/login"
            element={
              <GuestOnly isAuthenticated={props.session.isAuthenticated}>
                <Login onSuccess={handleAuthSuccess} />
              </GuestOnly>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnly isAuthenticated={props.session.isAuthenticated}>
                <Register onSuccess={handleAuthSuccess} />
              </GuestOnly>
            }
          />
          <Route
            path="*"
            element={<Navigate to={props.session.isAuthenticated ? '/' : '/login'} replace />}
          />
        </Routes>
      </main>
    </div>
  )
}

function RequireAuth({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function GuestOnly({ isAuthenticated, children }) {
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

function DashboardPage({
  user,
  posts,
  isLoadingPosts,
  statusMessage,
  errorMessage,
  onCreatePost,
  onRefreshPosts,
  onClearStatus,
}) {
  return (
    <div className="page-grid">
      <section className="stack">
        <div className="glass-panel hero-copy">
          <span className="badge w-fit">
            <Sparkles className="h-4 w-4 text-amber-300" />
            LumenBlog dashboard
          </span>

          <div className="space-y-3">
            <h1>Publish bright ideas in a polished glass workspace.</h1>
            <p>
              Draft posts, review the live feed, and keep your session synced with JWT
              auth.
            </p>
          </div>

          <div className="metrics-grid">
            <div className="metric">
              <strong>{posts.length}</strong>
              <span>posts in the feed</span>
            </div>
            <div className="metric">
              <strong>{user?.email || 'Signed in'}</strong>
              <span>active account</span>
            </div>
            <div className="metric">
              <strong>Live</strong>
              <span>API proxy to Express</span>
            </div>
          </div>
        </div>

        <div className="glass-card feed-card">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">Feed</h2>
              <p className="helper-text">Fresh posts from the Express API.</p>
            </div>

            <button type="button" className="icon-button" onClick={onRefreshPosts} aria-label="Refresh feed">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {statusMessage ? (
            <div className="status-success flex items-center justify-between gap-4">
              <span>{statusMessage}</span>
              <button type="button" className="text-sm font-semibold text-emerald-200" onClick={onClearStatus}>
                Dismiss
              </button>
            </div>
          ) : null}

          {errorMessage ? <div className="status-error">{errorMessage}</div> : null}

          <div className="feed-list">
            {isLoadingPosts ? (
              <div className="glass-card p-5 text-sm text-slate-300">Loading posts…</div>
            ) : posts.length > 0 ? (
              posts.map((post) => <PostCard key={post._id || `${post.title}-${post.createdAt}`} post={post} />)
            ) : (
              <div className="glass-card p-5 text-sm text-slate-300">
                No posts yet. Publish the first one on the right.
              </div>
            )}
          </div>
        </div>
      </section>

      <aside className="stack">
        <div className="glass-panel form-card">
          <div className="flex items-start gap-4">
            <div className="avatar-pill">
              <PenSquare className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">Create a post</h2>
              <p className="helper-text">Use the live API to publish a new entry.</p>
            </div>
          </div>

          <PostForm onSubmitPost={onCreatePost} />
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="avatar-pill">
              <Flame className="h-5 w-5 text-amber-300" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-white">Session</h2>
              <p className="helper-text">
                {user?.email ? `Authenticated as ${user.email}` : 'Using the stored JWT session.'}
              </p>
            </div>
          </div>

          <div className="divider" />

          <p className="muted">
            The app keeps the token in localStorage, sends it on request, and restores the
            session after refresh.
          </p>
        </div>
      </aside>
    </div>
  )
}

export default App
