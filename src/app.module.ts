import { UserModule } from "./user/user.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SensorsModule } from "./sensors/sensors.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { AuthenticationModule } from "./authentication/authentication.module";

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
      useUnifiedTopology: true,
      synchronize: true,
    }),
    SensorsModule,
    UserModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
