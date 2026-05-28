import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, MessageSquareText, UserPlus, LogIn, Feather } from 'lucide-react'

function Header({ user, isAuthenticated, onSignOut }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = () => {
    onSignOut()
    navigate('/login')
  }

  const isLoginPage = location.pathname === '/login'
  const isRegisterPage = location.pathname === '/register'

  return (
    <header className="topbar">
      <div className="glass-container">
        <div className="glass-panel topbar-row rounded-[28px] px-4 py-4 sm:px-6">
          <Link to={isAuthenticated ? '/' : '/login'} className="nav-link">
            <span className="brand-mark glow-ring">
              <Feather className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <strong className="text-base text-white">LumenBlog</strong>
              <span className="text-xs text-slate-300">glassmorphic express journal</span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="badge max-w-full">
                  <MessageSquareText className="h-4 w-4 text-emerald-300" />
                  <span className="truncate">
                    {user?.email ? `Signed in as ${user.email}` : 'Signed in'}
                  </span>
                </span>
                <button type="button" className="button-secondary" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`button-secondary ${isLoginPage ? 'border-amber-300/50 bg-white/8' : ''}`}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`button-primary ${isRegisterPage ? 'glow-ring' : ''}`}
                >
                  <UserPlus className="h-4 w-4" />
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
