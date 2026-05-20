//=============================================================================
// TAD_Empathy.js
//=============================================================================
/*:
 * @plugindesc TAD de Estructuras de Datos (Pilas y Colas) para el sistema de rumores y pistas.
 * @author Andres Mendible
 *
 * @help
 * Este plugin implementa un TAD que contiene una Pila y una Cola.
 * * Comandos para usar en eventos (pestaña 3 -> Script):
 * * GestorEmpathy.agregarPista("Texto de la pista");
 * GestorEmpathy.leerUltimaPista();
 * * GestorEmpathy.recibirRumor("Texto del rumor");
 * GestorEmpathy.leerSiguienteRumor();
 */

// --------------------------------------------------------
// ESTRUCTURA 1: Pila (Stack) - Último en entrar, primero en salir
// --------------------------------------------------------
class PilaPistas {
    constructor() {
        this.elementos = [];
    }
    apilar(pista) {
        this.elementos.push(pista);
    }
    desapilar() {
        if (this.elementos.length === 0) return "La libreta de pistas está vacía.";
        return this.elementos.pop();
    }
}

// --------------------------------------------------------
// ESTRUCTURA 2: Cola (Queue) - Primero en entrar, primero en salir
// --------------------------------------------------------
class ColaRumores {
    constructor() {
        this.elementos = [];
    }
    encolar(rumor) {
        this.elementos.push(rumor);
    }
    desencolar() {
        if (this.elementos.length === 0) return "No hay rumores nuevos en el celular.";
        return this.elementos.shift(); 
    }
}

// --------------------------------------------------------
// TAD: Gestor Principal que encapsula las estructuras
// --------------------------------------------------------
class TAD_SistemaJuego {
    constructor() {
        this.pistas = new PilaPistas();
        this.rumores = new ColaRumores();
    }

    // Métodos para interactuar con la libreta de pistas (Pila)
    agregarPista(texto) {
        this.pistas.apilar(texto);
    }

    leerUltimaPista() {
        let pista = this.pistas.desapilar();
        $gameMessage.add("\\c[4]Libreta de Cody:\\c[0]\n" + pista);
    }

    // Métodos para interactuar con los mensajes (Cola)
    recibirRumor(texto) {
        this.rumores.encolar(texto);
    }

    leerSiguienteRumor() {
        let rumor = this.rumores.desencolar();
        $gameMessage.add("\\c[3]Mensaje anónimo:\\c[0]\n" + rumor);
    }
}

// Instancia global para poder llamarlo desde los eventos del mapa
var GestorEmpathy = new TAD_SistemaJuego();