import { Controller, Get } from '@nestjs/common';
import { GetStructService } from './get-struct.service';

@Controller('get-struct')
export class GetStructController {
    constructor(private readonly getStructService: GetStructService) {}

    @Get()
    getDatabaseStructure(){
        return this.getStructService.getDatabaseStructure()
    }
}
