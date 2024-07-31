import { TestWeatherService } from './test-weather.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    ok: true,
    json: () => Promise.resolve({ data: 'fake-weather-data' }),
    headers: new Headers(),
    redirected: false,
    statusText: 'OK',
    type: 'default',
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn(),
  } as Response)
);

describe('TestWeatherService', () => {
  let service: TestWeatherService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestWeatherService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'WEATHER_API_URL':
                  return 'http://api.weatherapi.com/v1';
                case 'WEATHER_API_KEY':
                  return 'fake-api-key';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TestWeatherService>(TestWeatherService) as TestWeatherService;
    configService = module.get<ConfigService>(ConfigService) as ConfigService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get API URL', () => {
    const city = 'Paris';
    const url = service['getApiUrl'](city);
    expect(url).toBe('http://api.weatherapi.com/v1/current.json?key=fake-api-key&q=' + city);
  });

  it('should get weather data for all cities', async () => {
    const weatherData = await service.getWeather();
    expect(weatherData).toHaveLength(service.CITIES.length);
    weatherData.forEach((result) => {
      expect(result.status).toBe('fulfilled');
      expect(result.value).toEqual({ data: 'fake-weather-data' });
    });
  });

  it('should handle fetch errors gracefully', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        status: 404,
        ok: false,
        json: () => Promise.resolve({ error: 'not found' }),
        headers: new Headers(),
        redirected: false,
        statusText: 'Not Found',
        type: 'default',
        url: '',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        text: jest.fn(),
      } as Response)
    );

    const city = 'InvalidCity';
    try {
      await service['getData'](city);
    } catch (error) {
      expect(error).toEqual(new Error('Response status: 404'));
    }
  });
});