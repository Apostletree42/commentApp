import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './src/modules/users/entities/user.entity';
import { Comment } from './src/modules/comments/entities/comment.entity';
import { Notification } from './src/modules/notifications/entities/notification.entity';

const isProd = process.env.NODE_ENV === 'production';

const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  
  // Always prefer DATABASE_URL if it exists
  clientUrl: process.env.DATABASE_URL,
  
  // Different entity discovery for different environments
  entities: isProd 
    ? ['./dist/src/modules/**/*.entity.js'] 
    : [User, Comment, Notification],
  
  // Only use these if DATABASE_URL is not provided
  ...(process.env.DATABASE_URL ? {} : {
    dbName: process.env.DATABASE_NAME || 'comments',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
  }),
  
  migrations: {
    path: isProd ? './dist/migrations' : './migrations',
    tableName: 'migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
  },
  
  // Enhanced SSL configuration for cloud DB
  driverOptions: {
    connection: {
      ssl: process.env.DATABASE_URL ? {
        rejectUnauthorized: false
      } : false
    }
  },

  debug: !isProd && process.env.DEBUG_ORM === 'true',
  allowGlobalContext: true,
};

export default config;
