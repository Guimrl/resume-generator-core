/// <reference types="jest" />

import PrincipalCVController from "./PrincipalCVController";

describe("PrincipalCVController", () => {
  it("should generate a pdf from the request body", async () => {
    const controller = new PrincipalCVController();
    const req = {
      body: {
        personal: {
          name: "John Doe",
          age: 30,
          position: "Desenvolvedor Full Stack"
        },
        contact: {
          email: "john@example.com",
          phone: "+55 11 99999-9999",
          linkedin: "https://linkedin.com/in/johndoe",
          github: "https://github.com/johndoe",
          portfolio: "https://johndoe.dev"
        },
        address: {
          street: "Av. Paulista",
          number: 1000,
          city: "São Paulo",
          state: "SP",
          country: "Brasil",
          neighborhood: "Bela Vista",
          zip: "01310-100"
        },
        education: [],
        courses: [],
        language: [],
        experience: [],
        skills: [{ name: "TypeScript" }]
      }
    } as any;

    const res = {
      statusCode: 200,
      body: undefined as any,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(payload: unknown) {
        this.body = payload;
        return this;
      },
      send(payload: unknown) {
        this.body = payload;
        return this;
      }
    } as any;

    await controller.create(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("pdf");
    expect(typeof res.body.pdf).toBe("string");
    const document = Buffer.from(res.body.pdf, "base64");
    expect(document.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(document.toString("base64")).toBe(res.body.pdf);
  }, 30_000);
});
