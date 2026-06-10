import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicacionesProvider } from './context/PublicacionesContext'
import StartPage from './pages/StartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import CrearPublicacionPage from './pages/CrearPublicacionPage'
import PublicacionPage from './pages/PublicacionPage'

export default function App() {
  return (
    <PublicacionesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/iniciar-sesion" element={<LoginPage />} />
          <Route path="/registrarse" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/nueva-publicacion" element={<CrearPublicacionPage />} />
          <Route path="/publicacion/:id" element={<PublicacionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PublicacionesProvider>
  )
}
