import { rateLimit } from "express-rate-limit";

const pdfRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later."
  }
});

export default pdfRateLimiter;
