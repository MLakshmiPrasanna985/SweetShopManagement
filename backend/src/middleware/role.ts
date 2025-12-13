import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

const roleMiddleware = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};

export default roleMiddleware;
