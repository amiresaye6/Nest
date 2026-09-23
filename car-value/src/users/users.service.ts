import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.enntity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  find(email: string) {
    // will return an array with all values matched or empty array []
    if (email) return this.repo.find({ where: { email } });
    return this.repo.find();
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id });
    // console.log(`user found ${user}, id ${id}`)
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Object.assign will take all the attributes from the secon arguments and try to override it in the first object.
    Object.assign(user, attrs, { botato: 'chips' });
    return this.repo.save(user);
  }

  async delete(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user  not found');
    }
    return this.repo.remove(user);
  }
}
