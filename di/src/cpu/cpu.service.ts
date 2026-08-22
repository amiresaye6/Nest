import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class CpuService {
  constructor(public powerService: PowerService) {}

  compute(a: number, b: number) {
    console.log('requireing 10 watts of power');
    this.powerService.supplyPower(10);
    return a + b; 
  }
}
