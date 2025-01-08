import { rateLimit } from "express-rate-limit";


export const limitRequests = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 2000,
  legacyHeaders: true,
  standardHeaders: "draft-7",
  message: "You have exceeded the number of request, try again in 24 hours",
  statusCode: 403,
});


