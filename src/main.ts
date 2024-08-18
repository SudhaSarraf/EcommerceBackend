import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LoggerService } from './logger.service.ts/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      // origin: true,
      origin: [
        'http://localhost:4610',
        'http://localhost:3190',
        'http://localhost:5175',
        'http://192.168.1.89:4610',
        'http://192.168.1.66:3190',
        'http://192.168.100.59:3000',
        'http://192.168.29.117:3000',
        'http://192.168.1.155:4610',
        'http://192.168.1.83:4610',
        'http://192.168.1.109:5175',
        'http://192.168.137.1:5175',
        'http://192.168.1.221:4610',
        'http://192.168.31.149:3000',
        'http://192.168.1.219:3000',
        'http://192.168.1.72:3045',
        'https://giftsgarden.lennobyte.com',
        'https://ecomm.admin.lennobyte.com',
        'https://ecomm.api.lennobyte.com', 
      ],
      credentials: true,
      optionsSuccessStatus: 200,
      preflightContinue: false,
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  });

  // var whiteList = [
  //       'http://localhost:4610',
  //       'http://localhost:3190',
  //       'http://localhost:5175',
  //       'http://192.168.1.89:4610',
  //       'http://192.168.1.155:4610',
  //       'http://192.168.1.132:3190',
  //       'http://192.168.1.83:4610',
  //       'http://192.168.1.109:5175',
  //       'http://192.168.137.1:5175',
  //       'http://192.168.1.221:4610',
  //       'http://192.168.1.219:3000',
  //       'http://192.168.29.117:3000',
  //       'http://192.168.1.72:3045',
  //       'https://ecomm.admin.lennobyte.com',
  //       'https://giftsgarden.lennobyte.com',
  //    ];
  // app.enableCors({
  //   origin: function (origin, callback) {
  //     if (whiteList.indexOf(origin) != -1) {
  //       console.log('allowed cors for : ', origin);
  //       callback(null, true);
  //     } else {
  //       console.log('blocked cors for : ', origin);
  //       callback(new Error('Not allowed by Cors'));
  //     }
  //   },
  //   allowedHeaders: 'Content-Type, Accept, Authorization',
  //   methods: 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
  //   credentials: true,
  // });

  app.useLogger(app.get(LoggerService));

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT);
}

bootstrap();
