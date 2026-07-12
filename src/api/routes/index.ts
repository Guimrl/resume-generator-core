import { Application, Request, Response } from "express";
import principalCVRouter from "./PrincipalCVRouter";

const routes = (app: Application) => {
  app.route("/").get((req: Request, res: Response) => {
    res.status(200).send({ title: "Hello, world!" });
  });

  app.use(principalCVRouter);
};

export default routes;
