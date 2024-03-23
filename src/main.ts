import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { configSwagger } from './configs/api-docs.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3000;
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true, // Bỏ qua các trường không được cung cấp
      transform: true, // Tự động chuyển đổi các trường đầu vào thành kiểu dữ liệu tương ứng
      whitelist: true, // Loại bỏ các trường không được trang trí bởi class-validator
      forbidUnknownValues: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  configSwagger(app);
  await app.listen(port);
}
bootstrap();
