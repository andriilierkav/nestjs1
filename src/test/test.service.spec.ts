import { TestService } from './test.service';

describe('TestService', () => {
  let testService: TestService;

  beforeEach(() => {
    testService = new TestService();
  });

  it('should be defined', () => {
    expect(testService).toBeDefined();
  });

  it('should return date and time', () => {
    const dateTime = testService.getDateTime();
    expect(dateTime).toHaveProperty('date');
    expect(dateTime).toHaveProperty('time');
  });

  it('should return sorted array', () => {
    const body = ['Paris', 'New York', 'London', 'Berlin', 'Paris', 'Madrid', 'Kiev', 'Rome', 'Prague', 'Lisbon'];
    const sortedArray = testService.getSortedArray(body);
    expect(sortedArray).toEqual(body.sort());
  });
});