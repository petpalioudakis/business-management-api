import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/auth/user.entity';
describe('Staff Management (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  const BASE_URL = '/business';

  async function loadFixtures(connection) {
    const queryRunner = connection.createQueryRunner();
    const fixturesPath = path.join(__dirname, 'fixtures');
    const files = fs.readdirSync(fixturesPath);

    // Start a new transaction

    try {
      // await queryRunner.startTransaction();
      for (const file of files) {
        const entityName = path.basename(file, path.extname(file)); // Remove the file extension
        const repository = connection.getRepository(entityName);

        // Load the fixtures
        const fixtures = JSON.parse(
          fs.readFileSync(path.join(fixturesPath, file), 'utf8'),
        );

        // Save the fixtures
        await repository.save(fixtures);
      }

      // Commit the transaction
      // await queryRunner.commitTransaction();
    } catch (err) {
      // If something goes wrong, rollback the transaction
      //await queryRunner.rollbackTransaction();
      console.error(err);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  const tokenForUser = (
    user: Partial<User> = {
      id: 1,
      username: 'my_test_user',
    },
  ): string => {
    return app.get(AuthService).getUserToken(user as User);
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    connection = app.get(Connection);
    //await loadFixtures(connection);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return an empty list of businesses', () => {
    return request(app.getHttpServer()).get(BASE_URL).expect(200).expect([]);
  });

  it('should return a single business', async () => {
    await loadFixtures(connection);

    return request(app.getHttpServer())
      .get(`${BASE_URL}/1`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(1);
        expect(response.body.name).toBe('Business 1');
      });
  });

  it('should return a list of businesses (3)', async () => {
    await loadFixtures(connection);

    return request(app.getHttpServer())
      .get(BASE_URL)
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(3);
      });
  });

  it('should throw a an error when creating businesses being unauthenticated', () => {
    return request(app.getHttpServer())
      .post(BASE_URL)
      .send({ name: 'Test Business', location: 'Test Location' })
      .expect(401);
  });

  it('should throw an error when creating a business with wrong data', async () => {
    await loadFixtures(connection);

    return request(app.getHttpServer())
      .post(BASE_URL)
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({ name: 'Test Business' })
      .expect(400)
      .then((response) => {
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: [
            'location must be longer than or equal to 3 characters',
            'location must be a string',
          ],
          error: 'Bad Request',
        });
      });
  });

  it('should create a business', async () => {
    await loadFixtures(connection);
    const input = {
      name: 'Business 4',
      location: 'Location 4',
      business_type: 'bar',
    };
    return request(app.getHttpServer())
      .post(BASE_URL)
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send(input)
      .expect(201)
      .then((_) => {
        return request(app.getHttpServer())
          .get(`${BASE_URL}/4`)
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject({
              id: 4,
              ...input,
            });
          });
      });
  });

  it('should throw an error when changing a non existing business', async () => {
    await loadFixtures(connection);

    return request(app.getHttpServer())
      .put(`${BASE_URL}/4`)
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({})
      .expect(404);
  });

  it('should update a business name', async () => {
    await loadFixtures(connection);

    return request(app.getHttpServer())
      .patch(`${BASE_URL}/1`)
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({
        name: 'Business 1 Updated',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.name).toBe('Business 1 Updated');
      });
  });

  it('should remove a business', async () => {
    await loadFixtures(connection);

    return request(app.getHttpServer())
      .delete(`${BASE_URL}/1`)
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .expect(204)
      .then((response) => {
        return request(app.getHttpServer()).get(`${BASE_URL}/1`).expect(404);
      });
  });

  it('should throw an error when removing non existing business', async () => {
    await loadFixtures(connection);
    return request(app.getHttpServer())
      .delete(`${BASE_URL}/5`)
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .expect(404);
  });
});
