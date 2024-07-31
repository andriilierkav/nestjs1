import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestWeatherService {
  CITIES = ['Paris', 'asdk12345', 'London', 'Berlin', 'Paris', 'Madrid', 'Kiev', 'Rome', 'Prague', 'Lisbon'];
  constructor(private config: ConfigService) {
  }

  private getApiUrl(city: string): string {
    return `${this.config.get('WEATHER_API_URL')}/current.json?key=${this.config.get('WEATHER_API_KEY')}&q=${city}`
  }
  async getWeather():Promise<object[]> {
    console.log('getWeather-start');
    let promises = [];
    this.CITIES.forEach((city) => {
      promises.push(this.getData(city));
    });

    const promisesResult =  Promise.allSettled(promises);
    console.log('getWeather-end');
    return promisesResult;
  }

  private async getData(city: string):Promise<any> {
    // console.log('getData-start: ' + city);
    const url = this.getApiUrl(city);

    //await this.sleep(1000)    - just for testing
    const response = await fetch(url);
    if (response.status !== 200) {
      console.log('throw: ' + city, response);
      throw new Error(`Response status: ${response.status}`);
    }

    // console.log('getData-end: ' + city);
    return await response.json();
  }

  sleep (ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}