import { CreateUserEvent } from './User/dto/events/CreateUser.event';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './User/dto/createUser.dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	private users: any[] = [];

	constructor(@Inject('LOGGER') private readonly loggerClient: ClientProxy) {}

	getHello(): string {
		return 'Hello World!';
	}

	createUser(createUserDto: CreateUserDto) {
		this.users.push(createUserDto);
		this.loggerClient.emit('user_created', new CreateUserEvent(createUserDto.email));
	}
}
