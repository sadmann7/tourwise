import { type ReactNode } from "react";

// external imports
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
