import httpServer, { io } from './app';

const PORT = process.env.PORT || '5000';

const server = httpServer.listen(PORT, () => {
  console.log('info', `App listening on port ${PORT}`);
  console.info('================================');
  console.info(`======= ENV: ${process.env.NODE_ENV} =======`);
  console.info(`🚀 App listening on the port ${PORT}`);
  console.info(`url http://localhost:${PORT}`);
  console.info('================================');
});

// io.listen(server);


