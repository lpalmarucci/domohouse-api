import { Injectable } from "@nestjs/common";
import { User } from "../user/User.entity";
import { LoginDto } from "./dto/Login.dto";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    return await this.generateToken(loginDto as User);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsername(username);
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (user && isSamePassword) {
      return user;
    }
    return null;
  }

  async generateToken(user: User) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async validateRequestTokenByUser(userId: string, token: string) {
    const user = await this.userService.findById(userId);
    return user.token == token;
  }
}
