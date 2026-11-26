import type { ReactNode } from "react";
import { AuthLayout } from "../../routes/auth-layout";
export default function Layout({children}:{children:ReactNode}) {return <AuthLayout>{children}</AuthLayout>;}

