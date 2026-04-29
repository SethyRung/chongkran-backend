import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { setupSwagger } from "./config/swagger.config";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  setupSwagger(app);
  app.enableCors({
    origin: config.get<string>("ALLOW_ORIGIN"),
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  await app.listen(parseInt(config.get<string>("PORT") || "8080", 10));
}
bootstrap();
