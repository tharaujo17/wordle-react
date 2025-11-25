import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoomService } from './services/roomService.js';
import { EVENTS } from './utils/constants.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const roomService = new RoomService(io);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: roomService.rooms.size });
});

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on(EVENTS.CREATE_ROOM, ({ config, playerId, playerName }) => {
    try {
      const game = roomService.createRoom(config, playerId, playerName, socket.id);
      socket.join(game.roomId);
      
      socket.emit(EVENTS.ROOM_CREATED, {
        roomId: game.roomId,
        game: game.toJSON(),
      });
    } catch (error) {
      socket.emit(EVENTS.ERROR, { message: error.message });
    }
  });

  socket.on(EVENTS.JOIN_ROOM, ({ roomId, playerId, playerName }) => {
    try {
      const game = roomService.joinRoom(roomId, playerId, playerName, socket.id);
      socket.join(roomId);
      
      socket.emit(EVENTS.ROOM_JOINED, {
        roomId: game.roomId,
        game: game.toJSON(),
      });

      if (game.canStart()) {
        setTimeout(() => {
          roomService.startGame(roomId);
        }, 1000);
      }
    } catch (error) {
      socket.emit(EVENTS.ERROR, { message: error.message });
    }
  });

  socket.on(EVENTS.MAKE_GUESS, ({ roomId, playerId, guess }) => {
    try {
      roomService.makeGuess(roomId, playerId, guess);
    } catch (error) {
      socket.emit(EVENTS.ERROR, { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`CORS habilitado para: ${process.env.CORS_ORIGIN}`);
});