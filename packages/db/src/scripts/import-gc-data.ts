import { parse } from "csv-parse/sync";
import { db, gcData } from "../index";

const csvContent = `timestamp,sensors::gas-pid-1,sensors::gas-pid-2,sensors::gas-pid-3,sensors::temperature-sht31,sensors::humidity-sht31,sensors::temperature-bme680,sensors::humidity-bme680,sensors::pressure-bme680,sensors::gas-bme680,gcc::tc1,headspace::vacuum-pressure,headspace::sample-flow,headspace::carrier-flow,compressor::pressure,FOLDER_NAME,timestamp (right),phase-id,label-id,sensors::pid1-lamp,sensors::pid2-lamp,sensors::pid3-lamp,sensors::sht31-heating,gcc::pid-status,gcc::pid-setpoint,gcc::fan-status,headspace::pump-status,headspace::pump-power,headspace::valve-position,headspace::sample-flow-setpoint,headspace::sample-gas,headspace::carrier-flow-setpoint,headspace::carrier-gas,compressor::pump-status,compressor::pump-power,Iteration,FOLDER_NAME_SAMPLE_ID,label-id_SAMPLE_ID,START_DATETIME,date&time diff,Counter,Iteration (#1),timestamp_DATE,DATE_LABEL
2025-02-27T16:08:58.562659,0,-0.687,456.938,30.26,18.46,34.225,11.289,1020,12917166,23.938,-594,-0.098,53.125,1632,/Users/adomas/Documents/Sony/volatile-testing 2/data/2025-02-27/scout-3--11--2025-02-27T16-09-22Z/_recordings/scout-3--11--2025-02-27T16-09-45Z,2025-02-27 16:08:58.562659,,,1,1,1,0,0,50,0,0,1,0,0,1,50,1,1,1,0,0,,2025-02-27T16:08:58.562659,0,0,0,2025-02-27,`; // Add your CSV data here

async function importData() {
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  const data = records.map((record: any) => ({
    timestamp: new Date(record.timestamp),
    gasPid1: parseFloat(record["sensors::gas-pid-1"]),
    counter: parseInt(record.Counter),
    labelId: record["label-id"] || null
  }));

  await db.delete(gcData);
  await db.insert(gcData).values(data);
  console.log(`Imported ${data.length} records`);
}

importData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error importing data:", error);
    process.exit(1);
  }); 