import { apiRpc, getApiClient, InferRequestType } from "./client";

export async function getGCData() {
  const client = await getApiClient();
  const response = await client.gc.$get();
  return response.json();
}

export async function getGCLabels() {
  const client = await getApiClient();
  const response = await client.gc.labels.$get();
  return response.json();
} 