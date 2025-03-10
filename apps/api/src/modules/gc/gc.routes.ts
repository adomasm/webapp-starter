import { Hono } from "hono";
import { gcService } from "./gc.service";

export const gcRoutes = new Hono()
  .get("/", async (c) => {
    const data = await gcService.getGCData();
    return c.json(data);
  })
  .get("/labels", async (c) => {
    const labels = await gcService.getUniqueLabelIds();
    return c.json(labels);
  }); 