import { DataSource } from 'typeorm';

const { POSTGRESQL_USER, POSTGRESQL_PASSWORD, POSTGRESQL_DATABASE } =
  process.env;

export const myDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: POSTGRESQL_USER,
  password: POSTGRESQL_PASSWORD,
  database: POSTGRESQL_DATABASE,
  entities: ['src/entities/*.ts'],
  logging: true,
  synchronize: true,
});
