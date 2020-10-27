import express from 'express';
import log4js from 'log4js';
import log4jsConfig from './log4js.json';

const app = express();
const port = process.env.WEBAPP_PORT ?? 3000;

export default async function startupApp (id: number): Promise<void> {
  log4js.configure(log4jsConfig);
  const logger = log4js.getLogger(`app.${id}`);
  logger.info(`Started worker ${id}`);

  app.use((req, res, next) => {
    const start = new Date();
    const logger = log4js.getLogger(`api.${id}.${req.url}`);
    logger.debug(req.method.toUpperCase(), req.url);
    next();
    const finish = new Date();
    logger.debug(`[${res.statusCode}]`, req.method.toUpperCase(), req.url, (finish.getTime() - start.getTime()), 'ms');
  });

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    logger.info(`listening at http://localhost:${port}`);
  });

  let exited = false;

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  async function shutdown () {
    if (exited) return;
    exited = true;

    logger.info(`Worker ${id} cleanup done.`);
    process.exit();
  }
}
