/*
TODO:
https://nodejs.org/docs/latest/api/child_process.html#child_processexeccommand-options-callback
 - Get metrics for number of desired pods
 - get metrics for number of actual pods
 - get metrics for number of nodes
 */
import { InfluxDB, Point } from '@influxdata/influxdb-client';

import { promisify } from 'util';
import { exec } from 'child_process';

const url = 'http://localhost:8086';
const token = 'mysupersecretadmintoken';
const org = 'myorg';
const bucket = 'mybucket';

const client = new InfluxDB({ url: url, token: token });
const writeApi = client.getWriteApi(org, bucket);

const sleep = promisify(setTimeout);
const run = promisify(exec);

const cluster_name = 'my-managed-cluster';
const nodegroup_name = 'managed-ng-0';

async function getPodCount () {
  let stdout = '';
  let stderr = '';
  let error;

  try {
    const result = await run('kubectl get pods -l app=myapi -o json');
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (err) {
    error = err;
  }
  const pod_info = JSON.parse(stdout);
  const pod_status_count = pod_info.items.reduce((acc, cur) => {
    const phase = cur.status.phase;
    if (Object.keys(acc).includes(phase)) {
      acc[phase] = acc[phase] + 1;
    } else {
      acc[phase] = 1;
    }
    return acc;
  }, { Running: 0, Pending: 0 });

  const now = new Date();
  Object.entries(pod_status_count).forEach((x) => {
    writeApi.writePoint(new Point('pods').tag('phase', x[0]).floatField('count', x[1]).timestamp(now));
  });
  return pod_status_count;
}

async function getNodeCount () {
  let stdout = '';
  let stderr = '';
  let error;

  try {
    const result = await run('kubectl get nodes -o json');
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (err) {
    error = err;
  }
  const node_info = JSON.parse(stdout);
  const stats = node_info.items.reduce((acc, cur) => {
    const spec = cur.spec;
    acc.total = acc.total + 1;
    if (Object.keys(spec).includes('taints')) {
      const taints = spec.taints;
      taints.forEach(taint => {
        if (Object.keys(acc).includes(taint.effect)) {
          acc[taint.effect] = acc[taint.effect] + 1;
        } else {
          acc[taint.effect] = 1;
        }
      });
    }
    return acc;
  }, { total: 0 });
  const now = new Date();
  Object.entries(stats).forEach((x) => {
    writeApi.writePoint(new Point('nodes').tag('node_attribute', x[0]).floatField('count', x[1]).timestamp(now));
  });
  return stats;
}

async function getHPAStats () {
  let stdout = '';
  let stderr = '';
  let error;

  try {
    const result = await run('kubectl get hpa -o json');
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (err) {
    error = err;
  }
  const info = JSON.parse(stdout);
  const target = info.items[0].spec.targetCPUUtilizationPercentage;
  const current = info.items[0].status.currentCPUUtilizationPercentage;
  const now = new Date();
  writeApi.writePoint(new Point('hpa').tag('cpu', 'target').floatField('cpu_utilization', target).timestamp(now));
  writeApi.writePoint(new Point('hpa').tag('cpu', 'current').floatField('cpu_utilization', current).timestamp(now));
  return { target, current };
}

function exitHandler (signal, code) {
  console.log('EXIT', signal, code);

  writeApi
    .close()
    .then(() => {
      console.log('FINISHED');
    })
    .catch((e) => {
      console.error(e);
      console.log('Finished ERROR');
    });

  process.exit(code);
}

(async function main () {
  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);

  let results;

  while (true) {
    results = await Promise.allSettled([getHPAStats(), getNodeCount(), getPodCount(), sleep(1000)]);
    console.log(new Date(), results);
    writeApi.flush();
  }
})();
