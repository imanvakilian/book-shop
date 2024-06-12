namespace NodeJS {
    interface ProcessEnv {
        // database
        DB_HOST: string;
        DB_DATABASE: string;
        DB_PORT: number;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        // app
        PORT: number;
        // cookie & jwt
        COOKIE_SECRET: string;
        COOKIE_RN: string;
        JWT_REGISTSER_SECRET: string;
        JWT_ACCESS_SECRET: string;
        // zarin pal
        MERCHANT_ID: string;
    }
}