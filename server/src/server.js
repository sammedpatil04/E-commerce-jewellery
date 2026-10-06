const app = require('./app');
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('close', () => console.log('server closed'));
process.on('exit', (code) => console.log('process exit with code', code));
process.on('uncaughtException', (err) => console.log('uncaughtException', err));
process.on('unhandledRejection', (reason, promise) => console.log('unhandledRejection', reason));
