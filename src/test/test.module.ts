import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TestWeatherService } from './test-weather.service';

@Module({
  imports: [],
  controllers: [TestController],
  providers: [TestService, TestWeatherService],
  exports: []
})
export class TestModule {
}
