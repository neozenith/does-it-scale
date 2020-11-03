import http from 'http';
import request from 'supertest';
import startupApp from '../src/app';
let server: http.Server;

beforeAll(async () => {
  server = await startupApp(1);
});

describe('GET /', () => {
  it('should return 200 & a prime number', async done => {
    request(server)
      .get('/')
      // .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

afterAll(async () => {
  server.close();
});
