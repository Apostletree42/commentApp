import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    // Set up CORS
    app.enableCors({
      origin: [
        'http://localhost:5173',
        'http://localhost',
        'http://localhost:80',
        'https://treecomments.netlify.app',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type,Authorization',
      exposedHeaders: 'Content-Type,Authorization',
    });

    // Log the database connection info (safely)
    if (process.env.DATABASE_URL) {
      const dbUrlParts = new URL(process.env.DATABASE_URL);
      logger.log(`Connecting to database at ${dbUrlParts.hostname}`);
    } else {
      logger.log(`
        Connecting to database at ${process.env.DATABASE_HOST || 'localhost'}`);
    }

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on port ${port}`);
  } catch (error) {
    logger.error('Failed to start application:');
    logger.error(error);
    process.exit(1);
  }
}

bootstrap();
