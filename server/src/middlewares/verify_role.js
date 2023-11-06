import { notAuth } from "./handle_errors";

export const isTeacher = (req, res, next) => {
  const { role } = req.user;
  if (role !== "GV") return notAuth("Require role Teacher", res);
  next();
};

export const isStudent = (req, res, next) => {
  const { role } = req.user;
  if (role !== "HS") return notAuth("Require role Student", res);
  next();
};
