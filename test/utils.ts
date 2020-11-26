import http from 'http';
import https from 'https';

export type HttpVerb = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'OPTIONS';
export interface RequestOptions {
  host: string;
  port: number;
  path: string;
  method: HttpVerb;
  headers: Record<string, string>;
}

export function * reqGenerator (totalRequests: number, options: RequestOptions): IterableIterator<RequestOptions | undefined> {
  while (totalRequests > 0) {
    yield options;
    totalRequests--;
  }
}

export async function restRequest (options: RequestOptions): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const httpx = options.port === 443 ? https : http;
    let output = '';
    const req = httpx.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => (output += chunk));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(output);
        } catch (e) {
          reject(e);
        }
        if (parsed) resolve(parsed);
        else reject(new Error('parsed was undefined'));
      });
    });
    req.on('error', reject);
    req.end();
  });
};
