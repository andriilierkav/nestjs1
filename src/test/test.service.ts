import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class TestService {
  getDateTime(): { date: string; time: string } {
    const dt = DateTime.now();
    return {
      date: dt.toFormat('yyyy-MM-dd'),
      time: dt.toLocaleString(DateTime.TIME_24_WITH_SECONDS),
    };
  }
  getSortedArray(body: string[]): string[] {
    return body.sort();
  }
}
