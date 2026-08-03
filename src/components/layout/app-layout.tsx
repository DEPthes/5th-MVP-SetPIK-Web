import { Outlet } from "react-router-dom";
import { Footer } from "./footer";
import { Header } from "./header";

interface AppLayoutProps {
  headerVariant: "public" | "authenticated";
}

export function AppLayout({ headerVariant }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Header variant={headerVariant} />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
