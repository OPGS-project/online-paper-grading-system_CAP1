import { notAuth } from "./handle_errors";

export const isTeacher = (req, res, next) => {
  const { code } = req.user;
  if (code !== "GV") return notAuth("Require role Teacher", res);
  next();
};

export const isStudent = (req, res, next) => {
  const { code } = req.user;
  if (code !== "HS") return notAuth("Require role Student", res);
  next();
};
