import { CreateSensorDto } from "./dto/CreateSensor.dto";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { SensorsService } from "./sensors.service";

@Controller("sensors")
export class SensorsController {
  constructor(private sensorsService: SensorsService) {}

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
