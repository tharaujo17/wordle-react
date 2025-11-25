import { useEffect, useRef } from 'react';
import { socketService } from '../services/socket';

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = socketService.connect();

    return () => {
      // socketService.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
    isConnected: socketService.isConnected(),
  };
};