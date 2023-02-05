import { ObjectID } from "typeorm";
import { Observable } from "rxjs";
import { CreateUserDto } from "./dto/CreateUserDto";
import { User } from "./dto/User.entity";
import { UserService } from "./user.service";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findById(@Param("id") userId: string) {
    return this.userService.findById(userId);
  }

  @Post("new")
  createUser(@Body() userDto: CreateUserDto) {
    if (!userDto || Object.keys(userDto).length === 0) {
      throw new BadRequestException();
    }
    return this.userService.createUser(userDto);
  }
}
