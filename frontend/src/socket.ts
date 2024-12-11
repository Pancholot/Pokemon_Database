import { io, Socket } from "socket.io-client";

let socket: Socket | null; // Permite que sea undefined inicialmente

// Función para iniciar la conexión
export const initiateSocket = (): void => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      transports: ["websocket"], // Usa WebSockets
      reconnection: true, // Habilita la reconexión automática
      reconnectionAttempts: 5, // Número de intentos de reconexión
      reconnectionDelay: 2000, // Tiempo entre intentos
    });

    socket.on("connect", () => {
      console.log("Conectado al servidor Socket.IO");
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
    });

    socket.on("reconnect_attempt", () => {
      console.log("Intentando reconectar...");
    });

    socket.on("reconnect", () => {
      console.log("Reconectado exitosamente");
    });
  } else {
    console.log("Socket ya está conectado o en proceso de conexión.");
  }
};

// Función para desconectar el socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect(); // Cierra la conexión
    socket = null; // Resetea el valor de socket
    console.log("Socket desconectado");
  } else {
    console.warn("No hay un socket conectado para desconectar.");
  }
};

// Función para obtener el socket
export const getSocket = (): Socket | null => {
  if (!socket) {
    console.warn(
      "El socket no ha sido inicializado. Llama a initiateSocket() primero."
    );
  }
  return socket;
};
