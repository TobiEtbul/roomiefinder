import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicacionesProvider } from './context/PublicacionesContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PublicacionesPage from './pages/PublicacionesPage'
import NuevaPublicacionPage from './pages/NuevaPublicacionPage'

export default function App() {
  return (
    <PublicacionesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/iniciar-sesion" element={<LoginPage />} />
          <Route path="/registrarse" element={<RegisterPage />} />
          <Route path="/home" element={<PublicacionesPage />} />
          <Route path="/nueva-publicacion" element={<NuevaPublicacionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PublicacionesProvider>
  )
}
