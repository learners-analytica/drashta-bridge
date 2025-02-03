import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAnalyticsServiceStatus(){
    fetch("")
  }
  getServiceStatus() {
    return {message:'Hello World!'}
  }
}
