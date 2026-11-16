import { umcineClient } from "../umcine-client";
import type { AvailabilityResponse } from "./models";

type CheckNicknameResponse = AvailabilityResponse;

function checkNickname(nickname: string) {
  return umcineClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameResponse>();
}

export { checkNickname, type CheckNicknameResponse };
