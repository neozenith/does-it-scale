import throng from 'throng';
import log4js from 'log4js';
import log4jsConfig from './log4js.json';
import app from './app';

const concurrency = process.env.CONCURRENCY ?? 2;
const options: throng.Options = { workers: concurrency, master, start: app };
throng(options);

function master () {
  log4js.configure(log4jsConfig);
  const logger = log4js.getLogger('server');
  logger.info('Started master');

  process.on('beforeExit', () => {
    logger.info('Master cleanup.');
  });
}
