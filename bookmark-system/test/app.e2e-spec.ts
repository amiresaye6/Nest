import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { PrismaService } from '../src/prisma/prisma.service';

import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

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

    describe('Edit User', () => {
      const dto: EditUserDto = {
        firstName: 'Amir',
        email: 'mero@gmail.com',
      };
      it('should edit user details "first name and email"', async () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
          .inspect();
      });
    });
  });

  describe('Bookmarks testing', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', async () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectBodyContains([])
          .inspect();
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'NestJs Course for Beginners - Create a REST API',
        description:
          'Learn NestJs by building a CRUD REST API with end-to-end tests using modern web development techniques.',
        link: 'https://www.youtube.com/watch?v=GHTA143_b-s',
      };
      it('should create a new bookmark', async () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .stores('bookmarkId', 'id')
          .expectJsonLength(1)
          .inspect();
      });
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', async () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectJsonLength(1)
          .inspect();
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', async () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectJsonLength(1)
          .expectBodyContains('$S{bookmarId}')
          .inspect();
      });
    });

    describe('Edit bookmark', () => {
      const dto: EditBookmarkDto = {
        title:
          'NestJs Course for Beginners - Create a REST API botato chips, this is new stuff',
      };
      it('should edit bookmark by id', async () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(1)
          .expectBodyContains('$S{bookmarId}')
          .expectBodyContains(dto.title)
          .inspect();
      });
    });

    describe('Delete bookmark', () => {
      it('should edit bookmark by id', async () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(204)
          .inspect();
      });
    });

    describe('Get empty bookmarks', () => {
      it('should get empty bookmarks', async () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectBodyContains([])
          .inspect();
      });
    });
  });
});
