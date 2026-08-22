import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  // di version
  constructor(public messagesRepo: MessagesRepository) {}

  async findOne(id: string) {
    return this.messagesRepo.findOne(id);
  }

  async findAll() {
    return this.messagesRepo.findAll();
  }

  async createOne(content: string) {
    return this.messagesRepo.create(content);
  }
}
