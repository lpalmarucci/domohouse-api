import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  private users: any[] = [];

  getHello(): string {
    return "Hello World!";
  }
}
