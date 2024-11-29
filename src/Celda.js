import { useState } from "react";

function Celda({ valor = "", marcada = false, onCeldaClick, onCeldaMarcar }) {
    const handleContextMenu = (e) => {
        e.preventDefault(); // Previene el menú contextual
        onCeldaMarcar(); // Llama al manejador para alternar la marca
    };

    return (
        <div>
            <button
                className="border border-2 border-dark-subtle fs-2 fw-bold text-success"
                style={{ minWidth: 50, minHeight: 50 }}
                onClick={onCeldaClick}
                onContextMenu={handleContextMenu}
            >
                {marcada ? "/" : valor === " " ? "\u00A0" : valor}
            </button>
        </div>
    );
}

export default Celda;