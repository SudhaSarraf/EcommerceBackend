import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';


dotenv.config();

export const dataSourceOtps: DataSourceOptions = {
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: false,
    // autoLoadEntities: true,
    // entities: ['dist/**/*.entity{.ts,.js}'],
    // migrations: ['dist/migrations/*{.ts,.js}'],
    // migrationsTableName: "migrations",
    // migrationsRun: false,
    logging: true,

};

const dataSourceCli = new DataSource(dataSourceOtps);
export default dataSourceCli;