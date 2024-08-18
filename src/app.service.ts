import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const currentTime = new Date();
    const nepTime = currentTime.toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' });

    return `Current time ${nepTime}  GMT+0545 (Nepal Time)  `;
  }
}
