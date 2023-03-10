import { randomUUID } from "crypto";
import { CreateSensorDto } from "./dto/CreateSensor.dto";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class SensorsService {
  private sensors = new Map<string, CreateSensorDto>([
    [
      "861d6393-325c-4add-b0d8-30c55045f292",
      {
        id: "861d6393-325c-4add-b0d8-30c55045f292",
        name: "Sensor 2",
        description: "Description of second sensor",
        createdAt: "2023-01-29T19:55:23.775Z",
      } as CreateSensorDto,
    ],
    [
      "47844f2b-ff17-4352-acfe-b53df6bb197c",
      {
        name: "Sensor 1",
        description: "Description of first sensor",
        id: "47844f2b-ff17-4352-acfe-b53df6bb197c",
        createdAt: "2023-01-29T19:56:06.480Z",
      } as CreateSensorDto,
    ],
  ]);
  constructor(@Inject("LOGGER") private loggerService: ClientProxy) {}

  getAll() {
    return Array.from(this.sensors.values());
  }

  add(createSensorDto: CreateSensorDto) {
    const newSensor: CreateSensorDto = {
      ...createSensorDto,
      id: randomUUID(),
      createdAt: new Date().getTime().toString(),
    };
    this.sensors.set(newSensor.id, newSensor);
    this.loggerService.emit("new_sensor_created", newSensor);
    return newSensor;
  }

  getById(sensorId: string) {
    const sensor = this.sensors.get(sensorId);
    if (!sensor) return new NotFoundException("sensor not found");

    return sensor;
  }
}
