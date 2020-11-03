import express from 'express';
import log4js from 'log4js';
import log4jsConfig from './log4js.json';
import http from 'http';

import { getPrime } from './prime';

const app = express();
const port = process.env.WEBAPP_PORT ?? 3000;

export default async function startupApp (id: number): Promise<http.Server> {
  log4js.configure(log4jsConfig);
  const logger = log4js.getLogger(`app.${id}`);
  logger.info(`Started worker ${id}`);

  // Logging middleware
  app.use((req, res, next) => {
    const start = new Date();
    const logger = log4js.getLogger(`api.${id}.${req.url}`);
    logger.debug(req.method.toUpperCase(), req.url);

    res.on('close', () => {
      const finish = new Date();
      logger.debug(`[${res.statusCode}]`, req.method.toUpperCase(), req.url, (finish.getTime() - start.getTime()), 'ms');
    });

    next();
  });

  app.get('/', (req, res) => {
    const n = Math.round(Math.random() * 10000 + 1000);
    const nthPrime = getPrime(n);
    res.send({ prime: nthPrime });
  });

  const httpServer = app.listen(port, () => {
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
  return httpServer;
}
