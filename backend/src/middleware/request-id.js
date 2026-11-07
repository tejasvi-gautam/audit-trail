import crypto from "node:crypto";

export const requestIdMiddleware = (req, res, next) => {
  const requestId =
    req.get("x-request-id")?.trim() || crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  next();
};
