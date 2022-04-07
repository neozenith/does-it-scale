/*
TODO:
https://nodejs.org/docs/latest/api/child_process.html#child_processexeccommand-options-callback
 - Get metrics for number of desired pods
 - get metrics for number of actual pods
 - get metrics for number of nodes
 */

import { InfluxDB, Point } from "@influxdata/influxdb-client";

const url = "http://localhost:8086";
const token = "mysupersecretadmintoken";
const org = "myorg";
const bucket = "mybucket";

const client = new InfluxDB({ url: url, token: token });
const writeApi = client.getWriteApi(org, bucket);
const point = new Point("weatherstation")
  .tag("location", "San Francisco")
  .floatField("temperature", 23.4)
  .timestamp(new Date());

writeApi.writePoint(point);

writeApi
  .close()
  .then(() => {
    console.log("FINISHED");
  })
  .catch((e) => {
    console.error(e);
    console.log("Finished ERROR");
  });