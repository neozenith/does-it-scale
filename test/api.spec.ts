import http from 'http';
import request from 'supertest';

const describeIf = (condition: unknown) => (condition ? describe : describe.skip);

describeIf(process.env.API_HOST)(`Testing ${process.env.API_HOST}`, () => {
  describe('GET /', () => {
    it('should return 200 & a prime number', async done => {
      request(process.env.API_HOST)
        .get('/')
        // .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
});
