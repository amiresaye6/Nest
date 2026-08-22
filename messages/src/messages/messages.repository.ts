import { readFile, writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesRepository {
  private fileName = 'messagesFileDb.json';

  private async openFile(fileName: string) {
    const db = await readFile(fileName, 'utf-8');
    const messages = JSON.parse(db);
    return messages;
  }

  async findOne(id: string) {
    const messages = await this.openFile(this.fileName);
    return messages[id];
  }

  async findAll() {
    const messages = await this.openFile(this.fileName);
    return messages;
  }

  async create(content: string) {
    const messages = await this.openFile(this.fileName);
    const id = randomUUID();
    const message = {
      content,
      id,
    };

    messages[id] = message;
    writeFile(this.fileName, JSON.stringify(messages));
    return {
      message: 'message created successfully.',
      creataedDessage: message,
    };
  }
}
