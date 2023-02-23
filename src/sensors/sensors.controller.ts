import { CreateSensorDto } from "./dto/CreateSensor.dto";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { SensorsService } from "./sensors.service";
import { BaseController } from "../shared/BaseController";

@Controller("sensors")
export class SensorsController extends BaseController {
  constructor(private sensorsService: SensorsService) {
    super();
  }

  @Get()
  getAllSensors() {
    return this.sensorsService.getAll();
  }

  @Get("/:sensorId")
  getSensorById(@Query("sensorId") sensorId: string) {
    return this.sensorsService.getById(sensorId);
  }

  @Post("/add")
  addSensor(@Body() createSensorDto: CreateSensorDto) {
    return this.sensorsService.add(createSensorDto);
  }
}
