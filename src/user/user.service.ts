import { randomUUID } from "crypto";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./dto/User.entity";
import { ObjectID, Repository } from "typeorm";
import { Observable, from } from "rxjs";
import { CreateUserDto } from "./dto/CreateUserDto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private configService: ConfigService
  ) {}

  findAll(): Observable<User[]> {
    return from(this.userRepository.find());
  }

  async findById(userId: string) {
    const user: User = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    delete user.password;
    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<any> {
    const saltOrRounds: number = +this.configService.get("SALT_OR_ROUNDS");
    const password: string = await bcrypt.hash(userDto.password, saltOrRounds);
    const newUser = {
      id: randomUUID(),
      username: userDto.username.trim(),
      password,
      created_at: new Date(),
    };
    // const userCreated = this.userRepository.create(newUser);
    await this.userRepository.insert(newUser).catch((e) => {
      if (e.code === 11000)
        throw new BadRequestException(
          Object.keys(e.keyValue)[0] + " already taken"
        );
    });

    return {
      created: true,
      timestamp: newUser.created_at.getTime(),
    };
  }
}
