"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function ManagerShell({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#E8F1F2] text-[#13293D] font-sans antialiased">
      {/* Header */}
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Content Canvas */}
        <main className="flex-1 bg-[#E8F1F2] p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div>{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
