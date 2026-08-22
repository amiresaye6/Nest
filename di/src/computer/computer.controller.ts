import { Controller, Post } from '@nestjs/common';
import { CpuService } from 'src/cpu/cpu.service';
import { DiskService } from 'src/disk/disk.service';

@Controller('computer')
export class ComputerController {
  constructor(
    private cpuService: CpuService,
    private diskService: DiskService,
  ) {}
  @Post('/run')
  run() {
    return [this.cpuService.compute(1, 3), this.diskService.getData()];
  }
}
