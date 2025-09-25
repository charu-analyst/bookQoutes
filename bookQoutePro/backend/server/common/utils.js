// server/common/utils.js
import config from "config";
import jwt from "jsonwebtoken";

export const getToken = async (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    return error;
  }
};
