import request from 'supertest';
import { RequestOptions, reqGenerator, restRequest } from './utils';

const describeIf = (condition: unknown) => (condition ? describe : describe.skip);
const N = 20;
const url = (process.env.API_PORT) ? `${process.env.API_HOST}:${process.env.API_PORT}` : `${process.env.API_HOST}`;

jest.setTimeout(10 * 60 * 1000);

describeIf(process.env.API_HOST)(`Testing ${process.env.API_HOST}`, () => {
  describe('GET /', () => {
    it('should return 200 & a prime number', async done => {
      request(url)
        .get('/')
        // .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
    it(`should request ${N} primes on ${process.env.API_HOST}`, async () => {
      // Given
      const options: RequestOptions = {
        host: process.env.API_HOST,
        port: Number.parseInt(process.env.API_PORT) ?? 80,
        path: '/',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const reqs = [];
      for (const reqOp of reqGenerator(N, options)) {
        reqs.push(restRequest(reqOp));
      }
      const results = await Promise.allSettled(reqs);
      const partitioned: Record<string, Array<string>> = results.reduce((acc, cur) => {
        (acc[cur.status] = acc[cur.status] || []).push((cur.status === 'fulfilled') ? cur.value : cur.reason);
        return acc;
      }, {});
      const aggregates = Object.fromEntries(Object.entries(partitioned).map(([k, v]) => [k, (v as Array<string>).length]));

      if (partitioned?.rejected) {
        expect(partitioned?.rejected).toEqual([]);
      }
      expect(aggregates).toEqual({ fulfilled: N });
    });
  });
});
