import {
  Controller,
  Get,
  Injectable,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { TestService } from './test.service';
import { TestWeatherService } from './test-weather.service';
import { Request } from 'express';

@Controller('test')
@Injectable()
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly testWeatherService: TestWeatherService,
  ) {}

  @Get('date')
  dateTime() {
    return this.testService.getDateTime();
  }

  @Get('weather')
  async weather() {
    return await this.testWeatherService.getWeather();
  }

  @Post('sort-array')
  @UseGuards(JwtGuard)
  sortArray(@Req() req: Request) {
    return this.testService.getSortedArray(req.body);
  }

  @Get('test2')
  async test2() {
    return await this.testPromise();
  }
  async testPromise() {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve('test123');
      }, 1000);
    });
  }
}
