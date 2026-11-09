import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

import 'dotenv/config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.get('DATABASE_URL'),
    });
    super({ adapter });
  }

  // custom methord to clean up db for e2e testing.
  cleanDB() {
    return  this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany()
    ])
  }
}
