import app from './app';
import { envConfig } from './utils/envConfig';
import { logger } from './utils/logger';

app.listen(envConfig.port, () => {
  logger.info(`Server running on port ${envConfig.port}`, {
    env: envConfig.nodeEnv,
    clientUrl: envConfig.clientUrl,
  });
});
