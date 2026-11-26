import ky from "ky";
import { env } from "../config/env";

export const umcineClient = ky.create({
  baseUrl: `${env.apiBaseUrl}/`,
});
