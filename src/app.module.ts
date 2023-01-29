import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SensorsModule } from './sensors/sensors.module';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'LOGGER',
				transport: Transport.TCP,
				options: { port: 3001 },
			},
		]),
		SensorsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
