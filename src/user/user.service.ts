import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./User.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
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

  findAll(): Promise<Omit<User, "password">[]> {
    return this.userRepository.find({
      select: ["userId", "firstname", "lastname", "username", "created_at"],
    });
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
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async createUser(userDto: CreateUserDto): Promise<CreateUserDto> {
    const saltOrRounds: number = +this.configService.get("SALT_OR_ROUNDS");
    const password: string = await bcrypt.hash(userDto.password, saltOrRounds);

    const newUser: User = this.userRepository.create({
      ...userDto,
      password,
    });

    await this.userRepository.insert(newUser).catch((e) => {
      if (e.code === 11000)
        throw new BadRequestException("Username already taken");
    });

    return newUser;
  }

  async updateUser(
    userId: string,
    userDto: UpdateUserDto
  ): Promise<{ affected: number }> {
    const { affected }: UpdateResult = await this.userRepository.update(
      { userId },
      userDto
    );
    return { affected };
  }

  async deleteUser(userId: string): Promise<Omit<DeleteResult, "raw">> {
    const result: DeleteResult = await this.userRepository.delete({ userId });
    delete result.raw;
    return result;
  }
}
