import { createFileRoute } from "@tanstack/react-router";
import { EditProfilePage } from "../../pages/account/edit-profile-page";

export const Route = createFileRoute("/mypage/edit")({ component: EditProfilePage });
