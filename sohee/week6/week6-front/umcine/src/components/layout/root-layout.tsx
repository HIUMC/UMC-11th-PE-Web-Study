import { Outlet } from "@tanstack/react-router";
import { Header } from "./header";

function RootLayout() {
  return (
    <div className="app-shell">
      <Header />
      <Outlet />
    </div>
  );
}

export default RootLayout;
