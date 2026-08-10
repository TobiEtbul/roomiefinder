import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/iniciar-sesion.css'

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { iniciarSesion } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleEntrar(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Completá email y contraseña.')
      return
    }
    setEnviando(true)
    try {
      await iniciarSesion(email.trim(), password)
      navigate('/home')
    } catch (err) {
      setError(err.status === 401 || err.status === 400
        ? 'Email o contraseña incorrectos.'
        : err.message || 'No se pudo iniciar sesión.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login-page">
      <header className="page-header">
        <h1 className="page-title">Iniciar sesion</h1>
      </header>

      <main className="container">

        <form className="card" onSubmit={handleEntrar}>

          <div className="form-group">
            <label htmlFor="email">Correo electronico</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="amandaperez@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="**********"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            <button type="button" className="forgot-password">¿Olvidaste tu contraseña?</button>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn-entrar" type="submit" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>

          <button type="button" className="btn-social">
            <img src="/google.png" alt="Google" className="btn-social__icon" />
            Iniciar sesion con Google
          </button>

          <button type="button" className="btn-social">
            <img src="/facebook.png" alt="Facebook" className="btn-social__icon" />
            Iniciar sesion con Facebook
          </button>

          <p className="register-link">
            ¿No tienes cuenta? <Link to="/registrarse">Registrate</Link>
          </p>
        </form>

        <aside className="card right-panel">
          <span>Foto?</span>
        </aside>

      </main>
    </div>
  )
}
