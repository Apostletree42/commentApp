import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

// For migrations, we use a simplified config that doesn't import entities
const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  entities: ['./dist/src/modules/**/*.entity.js'],

  clientUrl: process.env.DATABASE_URL,

  dbName: process.env.DATABASE_NAME || 'comments',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',

  migrations: {
    path: './src/migrations',
    tableName: 'migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
  },
  debug: process.env.NODE_ENV !== 'production',
  allowGlobalContext: true,
  discovery: {
    warnWhenNoEntities: true,
    requireEntitiesArray: false,
  },
  driverOptions: {
    connection: {
      ssl:
        process.env.NODE_ENV === 'production'
          ? {
              rejectUnauthorized: false,
            }
          : false,
    },
  },
};

export default config;
