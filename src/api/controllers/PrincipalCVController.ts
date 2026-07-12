import { Request, Response } from "express";
import { PricipalCVPDF } from "../../core/templates/principal-cv/PrincipalCV";
import { DataInfo } from "../../core/templates/principal-cv/types";

class PrincipalCVController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body as DataInfo;
      const pdfGenerator = new PricipalCVPDF();
      const pdf = await pdfGenerator.generate(data);

      return res.status(201).json({
        message: "Principal CV PDF generated successfully",
        pdf
      });
    } catch (error: unknown) {
      return res.status(500).json({
        message: `Error: ${error instanceof Error
          ? error.message
          : "unknown error - failed to create a Principal CV."}`
      });
    }
  }
}

export default PrincipalCVController;
