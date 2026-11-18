import { createFileRoute } from "@tanstack/react-router";
import { EditProfilePage } from "../../../pages/member/edit-profile-page";

export const Route = createFileRoute("/(member)/_auth/edit-profile")({ component: EditProfilePage });
