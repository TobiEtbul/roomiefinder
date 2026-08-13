import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PublicacionesProvider } from './context/PublicacionesContext'
import StartPage from './pages/StartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import CrearPublicacionPage from './pages/CrearPublicacionPage'
import EditarPublicacionPage from './pages/EditarPublicacionPage'
import PublicacionPage from './pages/PublicacionPage'
import PerfilPage from './pages/PerfilPage'
import EditarPerfilPage from './pages/EditarPerfilPage'
import InscriptosPage from './pages/InscriptosPage'

export default function App() {
  return (
    <AuthProvider>
      <PublicacionesProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/iniciar-sesion" element={<LoginPage />} />
          <Route path="/registrarse" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/nueva-publicacion" element={<CrearPublicacionPage />} />
          <Route path="/editar-publicacion/:id" element={<EditarPublicacionPage />} />
          <Route path="/publicacion/:id" element={<PublicacionPage />} />
          <Route path="/publicacion/:id/inscriptos" element={<InscriptosPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/editar-perfil" element={<EditarPerfilPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PublicacionesProvider>
    </AuthProvider>
  )
}
