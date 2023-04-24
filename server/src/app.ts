import 'dotenv/config';
import express from 'express';
import type MessageResponse from './interfaces/MessageResponse';
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';
import api from './routes/api.routes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

const httpServer = createServer(app);
export const io = new Server(httpServer, { path: '/webrtc', cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

const webRTNamespace = io.of('/webRTCPeers');

webRTNamespace.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.emit('connection-success', { success: socket.id });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });

  socket.on('sdp', (data) => {
    console.log('sdp', data);
    socket.broadcast.emit('sdp', data);
  });
  socket.on('candidate', (data) => {
    console.log('candidate', data);
    socket.broadcast.emit('candidate', data);
  });
});

app.get<Record<string, unknown>, MessageResponse>('/', (_, res) => {
  res.json({
    message: '👋🌎🚀',
  });
});

app.use('/api', api);

app.use(notFound);
app.use(errorHandler);

export default httpServer;
