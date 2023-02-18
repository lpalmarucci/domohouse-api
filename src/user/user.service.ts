import { randomUUID } from "crypto";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./User.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { from, Observable } from "rxjs";
import { CreateUserDto } from "./dto/CreateUser.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "./dto/UpdateUser.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private configService: ConfigService
  ) {}

  findAll(): Observable<Omit<User, "password">[]> {
    return from(
      this.userRepository.find({
        select: ["userId", "firstname", "lastname", "username", "created_at"],
      })
    );
  }

  async findById(userId: string): Promise<Omit<User, "password">> {
    const user: User = await this.userRepository.findOne({
      select: ["userId", "firstname", "lastname", "username", "created_at"],
      where: {
        userId,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    delete user.password;
    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const saltOrRounds: number = +this.configService.get("SALT_OR_ROUNDS");
    const password: string = await bcrypt.hash(userDto.password, saltOrRounds);
    const newUser: User = {
      ...userDto,
      userId: randomUUID(),
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

    // TODO
    // Return access token

    delete newUser.password;
    return newUser;
  }

  async updateUser(
    userId: string,
    userDto: UpdateUserDto
  ): Promise<UpdateResult> {
    return await this.userRepository.update({ userId }, userDto);
  }

  async deleteUser(userId: string): Promise<Omit<DeleteResult, "raw">> {
    const result: DeleteResult = await this.userRepository.delete({ userId });
    delete result.raw;
    return result;
  }
}
