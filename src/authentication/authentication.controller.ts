import {
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";

@Controller("auth")
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Request() req) {
    return this.authService.login(req.user);
  }
}
