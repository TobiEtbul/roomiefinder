import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <>
      <header>
        <div className="logo">Logo</div>
        <nav>
          <Link to="/iniciar-sesion">Iniciar sesión</Link>
          <Link to="/registrarse">Registrarse</Link>
        </nav>
      </header>
      <hr />
    </>
  )
}
