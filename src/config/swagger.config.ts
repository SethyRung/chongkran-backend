import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

export const setupSwagger = (app: INestApplication) => {
  const config = new ConfigService();

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: config.get<string>("SITE_TITLE"),
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const options = new DocumentBuilder()
    .setTitle(config.get<string>("API_NAME") || "Chongkran API")
    .setDescription(config.get<string>("API_DESCRIPTION") || "Nest JS & MongoDB")
    .setVersion(config.get<string>("API_CURRENT_VERSION") || "1.1")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get<string>("API_ROOT") || "api/docs", app, document, customOptions);
};
