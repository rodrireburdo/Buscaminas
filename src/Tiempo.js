import { useState, useEffect } from "react";

export default function Tiempo({ juegoActivo, reiniciarTiempo }) {
    const [seconds, setSeconds] = useState(0);

    // Reinicia el contador cuando `reiniciarTiempo` es `true`
    useEffect(() => {
        if (reiniciarTiempo) {
            setSeconds(0);
        }
    }, [reiniciarTiempo]);

    useEffect(() => {
        if (!juegoActivo) {
            return; // No inicia el temporizador si el juego está inactivo
        }

        const idTemporizador = setInterval(() => {
            setSeconds((seconds) => seconds + 1);
        }, 1000);

        return () => {
            clearInterval(idTemporizador);
        };
    }, [juegoActivo]); // Se ejecuta cuando cambia el estado de `juegoActivo`

    return (
        <div
            className="lcdText text-danger pe-2 m-2 borderInsideS"
            style={{ width: 54 }}
        >
            {seconds}
        </div>
    );
}
