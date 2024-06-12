import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function initTypeOrm(): TypeOrmModuleOptions {
    const { DB_HOST, DB_DATABASE, DB_PORT, DB_USERNAME, DB_PASSWORD } = process.env;
    return {
        type: "postgres",
        host: DB_HOST,
        database: DB_DATABASE,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        entities: [
            "dist/**/**/**/*.entity{.ts,.js}",
            "dist/**/**/*.entity{.ts,.js}",
        ],
        synchronize: true,
    }
}