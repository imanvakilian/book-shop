import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function initSwagger(app: INestApplication) {
    const document = new DocumentBuilder()
        .setTitle("book shop")
        .setDescription("backend of book shop")
        .setVersion("v0.0.1")
        .setContact("iman vakilinan", "https://github.com/imanvakilinan", "imanvakiliangit@gmail.com")
        .addBearerAuth(bearerOptions(), "Authorization")
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, document);
    SwaggerModule.setup("/swagger", app, swaggerDocument);
}

const bearerOptions = (): SecuritySchemeObject => {
    return {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
    }
}