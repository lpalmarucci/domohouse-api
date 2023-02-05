import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SensorsModule } from "./sensors/sensors.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mongodb",
      url: process.env.DATABASE_URL,
      database: process.env.DATABASE_NAME,
      logging: true,
      autoLoadEntities: true,
      useNewUrlParser: true,
      entities: [join(__dirname, "**/**.entity{.ts,.js}")],
    }),
    SensorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
