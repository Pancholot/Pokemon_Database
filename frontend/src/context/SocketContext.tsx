import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { initiateSocket, getSocket, disconnectSocket } from "../socket";

// Aqui nos aseguramos del tipo de dato que necesita el contexto
type SocketContextType = Socket | null;

// Creamos el contexto
const SocketContext = createContext<SocketContextType | null>(null);

// Los props
interface SocketProviderProps {
  children: React.ReactNode;
}

// Componente que provee el contexto
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState<SocketContextType>(null);

  useEffect(() => {
    //inicializamos el socket
    initiateSocket();
    //obtenemos el socket
    setSocketInstance(getSocket() || null);

    return () => {
      //cerramos el socket
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = (): SocketContextType => {
  const socket = useContext(SocketContext);

  if (!socket) {
    console.warn(
      "Socket is not initialized. Ensure you are using the SocketProvider."
    );
  }

  // retornamos el socket
  return socket;
};
