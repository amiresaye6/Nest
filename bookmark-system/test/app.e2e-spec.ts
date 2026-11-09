import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { PrismaService } from '../src/prisma/prisma.service';

import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(1234);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();

    pactum.request.setBaseUrl('http://localhost:1234');
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Auth testing', () => {
    const dto: AuthDto = {
      email: 'botato@chips.com',
      password: 'potatoPassword123',
    };

    describe('Sign up', () => {
      it('Should sign up a user', async () => {
        return pactum
          .spec()
          .post('/auth/signup') // actual resuest goes here, url and method.
          .withBody(dto) // set body with the requist " if any "
          .expectStatus(201) // check status code
          .inspect(); // log response along side the headers to the console
      });

      it('Should throw if email is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('Should throw if password is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('Should throw if body is empty', async () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
    });

    describe('Sign in', () => {
      it('Should sign in a user', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .inspect()
          .stores('userAccessToken', 'token');
      });

      it('Should throw if email is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('Should throw if password is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('Should throw if body is empty', async () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
    });
  });

  describe('Users testing', () => {
    describe('Get me', () => {
      it('should return current logged in user details', async () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .inspect();
      });
    });

    describe('Edit User', () => {});
  });

  describe('Bookmarks testing', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark', () => {});

    describe('Delete bookmark', () => {});
  });
});
