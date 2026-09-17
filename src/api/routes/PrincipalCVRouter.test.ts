/// <reference types="jest" />

import { Server } from "http";
import { AddressInfo } from "net";
import app from "../../index";
import PrincipalCVController from "../controllers/PrincipalCVController";

jest.mock("../controllers/PrincipalCVController", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    create: jest.fn((_req, res) => res.status(201).json({ pdf: "pdf" }))
  }))
}));

describe("PrincipalCVRouter", () => {
  let server: Server;
  let url: string;

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, "127.0.0.1", resolve);
    });
    url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });
  });

  it("blocks the sixth PDF request before the controller and keeps the root accessible", async () => {
    for (let index = 0; index < 5; index++) {
      const response = await fetch(`${url}/principal`, { method: "POST" });
      expect(response.status).toBe(201);
      await response.json();
    }

    const response = await fetch(`${url}/principal`, { method: "POST" });

    expect(response.status).toBe(429);
    expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(response.headers.has("RateLimit")).toBe(true);
    expect(await response.json()).toEqual({
      message: "Too many requests. Please try again later."
    });

    const controller = jest.mocked(PrincipalCVController).mock.results[0].value;
    expect(controller.create).toHaveBeenCalledTimes(5);

    const rootResponse = await fetch(url);
    expect(rootResponse.status).toBe(200);
    await rootResponse.json();
  });
});
