import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  getDateTime(): { date: string, time: string } {
    const now = new Date();
    return {
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0]
    };
  }
  getSortedArray(body: string[]): string[] {
    return body.sort();
  }
}