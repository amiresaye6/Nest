import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.enntity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'botatyo@chips.com',
          password: 'chips',
        } as User),
      find: (email: string) =>
        Promise.resolve([
          { id: 1, email, password: 'test password' },
        ] as User[]),
      // delete: (id: number) =>
      //   Promise.resolve({
      //     id,
      //     email: 'botatyo@chips.com',
      //     password: 'chips',
      //   } as User),
      // update: (id: number, attrs: Partial<User>) => {
      //   const user = { id, email: 'test@gmail.com', password: 'test' };
      //   Object.assign(user, attrs);
      //   return Promise.resolve(user as User);
      // },
    };

    fakeAuthService = {
      // signup: (email: string, password: string) => {
      //   return Promise.resolve({ id: 1, email, password } as User);
      // },
      // signin: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  // it('findUser throws an error if user with given id is not found', async () => {
  //   fakeUsersService.findOne = () => null;
  //   await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  // });
});
