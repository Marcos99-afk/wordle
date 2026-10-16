import { useEffect, useState } from 'react'
import Casilla from './components/Casilla.jsx'

const FILAS = 6
const COLUMNAS = 5

// Lista de palabras de 5 letras
const PALABRAS = ['PERRO', 'GATOS', 'ARBOL', 'NIEVE', 'PLAYA']

function tableroVacio() {
  const tablero = []
  for (let f = 0; f < FILAS; f++) {
    tablero.push(Array(COLUMNAS).fill(''))
  }
  return tablero
}

// falsos repetidos
function calcularColoresFila(filaIntento, palabraSolucion) {
  const tamaño = palabraSolucion.length
  const colores = Array(tamaño).fill('ausente') 
  const letrasDisponibles = palabraSolucion.split('')

  //Letras en la posición correcta (Verde)
  for (let i = 0; i < tamaño; i++) {
    if (filaIntento[i] === palabraSolucion[i]) {
      colores[i] = 'correcta'
      letrasDisponibles[i] = null 
    }
  }

  //Letras que existen pero en otra posición (Amarillo)
  for (let i = 0; i < tamaño; i++) {
    if (colores[i] === 'correcta') continue 

    const letraActual = filaIntento[i]
    const indexEnSolucion = letrasDisponibles.indexOf(letraActual)

    if (indexEnSolucion !== -1) {
      colores[i] = 'presente'
      letrasDisponibles[indexEnSolucion] = null 
    }
  }

  return colores
}

function App() {
  const [intentos, setIntentos] = useState(tableroVacio())
  const [filaActual, setFilaActual] = useState(0)
  
  // Palabra aleatoria
  const [solucion, setSolucion] = useState(() => {
    return PALABRAS[Math.floor(Math.random() * PALABRAS.length)]
  })

  // Fila incompleta
  const [aviso, setAviso] = useState('')

  const ultimo = filaActual > 0 ? intentos[filaActual - 1].join('') : ''
  const ganada = ultimo === solucion
  const terminada = ganada || filaActual === FILAS

  useEffect(() => {
    document.querySelector('.casilla:enabled')?.focus()
  }, [filaActual])

  function cambiarLetra(f, c, evento) {
    const letra = evento.target.value.toUpperCase()
    if (!/^[A-ZÑ]?$/.test(letra)) return

    const copia = intentos.map((fila) => [...fila])
    copia[f][c] = letra
    setIntentos(copia)
    if (letra !== '') {
      const inputs = event.target.closest('.fila').querySelectorAll('.casilla')
      inputs[c + 1]?.focus()
    }
  }

  // Retroceso y borrado
  function manejarRetroceso(evento, c) {
    if (evento.key === 'Backspace' && evento.target.value === '') {
      const inputs = event.target.closest('.fila').querySelectorAll('.casilla')
      inputs[c - 1]?.focus()
    }
  }

  function comprobar(evento) {
    evento.preventDefault()
    if (terminada) return
    
    //Aviso si faltan letras
    setAviso('')
    if (intentos[filaActual].includes('')) {
      setAviso('Faltan letras')
      return
    }

    setFilaActual(filaActual + 1)
  }

  // Reestablecer tablero
  function reiniciarPartida() {
    setIntentos(tableroVacio())
    setFilaActual(0)
    setAviso('')
    setSolucion(PALABRAS[Math.floor(Math.random() * PALABRAS.length)])
  }

  return (
    <form className="juego" onSubmit={comprobar}>
      <h1>Wordle</h1>
      <div className="tablero">
        {intentos.map((fila, f) => {
          // Colores de la mejora 5
          const coloresFila = f < filaActual ? calcularColoresFila(fila, solucion) : []

          return (
            <div className="fila" key={f}>
              {fila.map((letra, c) => (
                <Casilla
                  key={c}
                  letra={letra}
                  estado={f < filaActual ? coloresFila[c] : ''}
                  activa={f === filaActual && !terminada}
                  onCambio={(evento) => cambiarLetra(f, c, evento)}
                  onKeyDown={(evento) => manejarRetroceso(evento, c)} // [MEJORA 4] Pasa el índice de columna
                />
              ))}
            </div>
          )
        })}
      </div>

      {/*condicional del aviso de error */}
      {aviso && <p className="aviso" style={{ color: 'red', fontWeight: 'bold' }}>{aviso}</p>}

      {/* mensaje de partida finalizada y boton de partida nueva */}
      {terminada ? (
        <div className="contenedor-final">
          <p className="mensaje" role="status">
            {ganada ? '¡Enhorabuena, has acertado!' : `La palabra era ${solucion}`}
          </p>
          <button className="boton" type="button" onClick={reiniciarPartida}>
            Nueva partida
          </button>
        </div>
      ) : (
        <button className="boton" type="submit">
          Comprobar
        </button>
      )}
    </form>
  )
}

export default App
