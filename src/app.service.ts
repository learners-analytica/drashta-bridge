import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServiceStatus() {
    return {message:'Hello World!'}
  }
}
