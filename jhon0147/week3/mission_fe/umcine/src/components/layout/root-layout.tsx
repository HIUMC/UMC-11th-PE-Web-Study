import { Outlet } from "@tanstack/react-router";
import { Footer } from "./footer";
import { Header } from "./header";

export function RootLayout() {
  return (
    <div className="flex min-h-screen min-w-80 flex-col bg-[#f6f8fb] font-sans text-slate-900 antialiased">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
