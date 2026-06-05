import '../styles/inicio.css'
import Navbar from '../components/Navbar'

export default function HomePage() {
  return (
    <div className="inicio-page">
      <Navbar />
      <main>
        <h1>Roomie<br />Finder</h1>
        <p>Encuentra compañeros de renta de forma facil</p>
      </main>
    </div>
  )
}
