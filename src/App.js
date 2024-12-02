import './App.css';
import { useState } from 'react';
import Celda from './Celda';
import Tiempo from './Tiempo';

function App() {
  //Estado para controlar si el juego esta activo
  const [juegoActivo, setJuegoActivo] = useState(true);

  //Estado reiniciar el tiempo a 0
  const [reiniciarTiempo, setReiniciarTiempo] = useState(false);

  //Almacena el tablero generado
  const [valores, setValores] = useState([]);

  //Definir propiedades y valores
  const [mapaValores, setMapaValores] = useState(Array(25).fill(" "));

  const celdas = mapaValores.map((item, index) => (
    <div className="col-auto p-0" key={index}>
      <Celda
        valor={item.valor}
        marcada={item.marcada}
        onCeldaClick={() => mostrarValor(index)}
        onCeldaMarcar={() => marcarCelda(index)} // Maneja clic derecho
      />
    </div>
  ));

  // Funcion boton comenzar partida
  const btnComenzar = () => {
    const tamano = 25;
    const numBombas = 5;
    const nuevoTablero = generarTablero(tamano, numBombas);
    setMapaValores(Array(tamano).fill({ valor: " ", marcada: false })); // Limpia marcas y valores
    setJuegoActivo(true);
    setReiniciarTiempo(true); // Reinicia el tiempo
    setTimeout(() => setReiniciarTiempo(false), 0);
    setValores(nuevoTablero); // Actualiza los valores del tablero
  };  
  
  const verificarVictoria = (valoresNuevos) => {
    // Verifica si todas las celdas no descubiertas son bombas
    const haGanado = valores.every((valor, i) => 
      valor === "*" || valoresNuevos[i].valor !== " "
    );
  
    if (haGanado && valoresNuevos.some((celda) => celda.valor !== " ")) { // Agrega condición de que haya movimientos
      setJuegoActivo(false);
      alert("¡Felicidades, ganaste!");
    }
  };
  

  // Función para marcar una celda con "/"
  const marcarCelda = (index) => {
    setMapaValores((prev) => {
      const nuevosValores = prev.map((celda, i) =>
        i === index ? { ...celda, marcada: !celda.marcada } : celda
      );
      verificarVictoria(nuevosValores); // Verificar victoria tras marcar
      return nuevosValores;
    });
  };

  // Funcion mostrar valor
  const mostrarValor = (index) => {
    if (!juegoActivo) return;
  
    if (valores[index] === "*") {
      // Mostrar todas las bombas y terminar el juego
      setMapaValores((prev) =>
        prev.map((celda, i) => ({
          valor: valores[i] === "*" ? "*" : celda.valor,
          marcada: false, // Elimina marcas al perder
        }))
      );
      setJuegoActivo(false);
      alert("¡Perdiste!");
    } else {
      // Mostrar el valor de la celda seleccionada
      setMapaValores((prev) => {
        const nuevosValores = prev.map((celda, i) =>
          i === index ? { ...celda, valor: valores[i] } : celda
        );
        verificarVictoria(nuevosValores); // Verificar victoria tras actualizar
        return nuevosValores;
      });
    }
  };

  const generarTablero = (tamano, numBombas) => {
    const tablero = Array(tamano).fill(0);
  
    // Coloca las bombas en posiciones aleatorias
    let bombasColocadas = 0;
    while (bombasColocadas < numBombas) {
      const posicion = Math.floor(Math.random() * tamano);
      if (tablero[posicion] !== "*") {
        tablero[posicion] = "*";
        bombasColocadas++;
      }
    }
  
    // Calcula los números para celdas adyacentes a bombas
    const obtenerVecinos = (index) => {
      const filas = Math.sqrt(tamano);
      const vecinos = [];
      const esBordeIzq = index % filas === 0;
      const esBordeDer = (index + 1) % filas === 0;
  
      // Vecinos (izquierda, derecha, arriba, abajo y diagonales)
      if (!esBordeIzq) vecinos.push(index - 1); // Izquierda
      if (!esBordeDer) vecinos.push(index + 1); // Derecha
      if (index - filas >= 0) {
        vecinos.push(index - filas); // Arriba
        if (!esBordeIzq) vecinos.push(index - filas - 1); // Arriba izquierda
        if (!esBordeDer) vecinos.push(index - filas + 1); // Arriba derecha
      }
      if (index + filas < tamano) {
        vecinos.push(index + filas); // Abajo
        if (!esBordeIzq) vecinos.push(index + filas - 1); // Abajo izquierda
        if (!esBordeDer) vecinos.push(index + filas + 1); // Abajo derecha
      }
      return vecinos;
    };
  
    for (let i = 0; i < tamano; i++) {
      if (tablero[i] === "*") continue;
  
      const vecinos = obtenerVecinos(i);
      const cantidadBombas = vecinos.filter((pos) => tablero[pos] === "*").length;
      tablero[i] = cantidadBombas > 0 ? cantidadBombas.toString() : "0";
    }
  
    return tablero;
  };

  useState(() => {
    const tamano = 25;
    const numBombas = 5;
    const nuevoTablero = generarTablero(tamano, numBombas);
    setValores(nuevoTablero);
    setMapaValores(Array(tamano).fill({ valor: " ", marcada: false })); // Inicializa correctamente
  }, []);

  return (
    <div className="container text-center" style={{ width: 340 }}>
      <div className="grid bg-body-secondary py-2 px-4 borderOutSide m-0">
        <div className="row bg-body-secondary borderInside ">
          <div className="d-flex flex-wrap justify-content-around">
            <div className="lcdText text-danger pe-2 m-2 borderInsideS">05</div>
            <div className="align-self-center m-2 borderInsideS">
              <img src="images/acierto.png" alt="acierto" style={{ width: 50 }} />
            </div>
            <Tiempo juegoActivo={juegoActivo} reiniciarTiempo={reiniciarTiempo} />
          </div>
        </div>
        <div className="row borderInside bg-body-secondary text-center justify-content-center">
          <div className="col my-1 p-0">
            <div className="d-flex flex-wrap justify-content-center">
              {celdas}
            </div>
          </div>
        </div>
      </div>
      <div><button className='btn btn-outline-secondary mt-2' onClick={btnComenzar}>COMENZAR PARTIDA</button></div>
    </div>
  );
}

export default App;