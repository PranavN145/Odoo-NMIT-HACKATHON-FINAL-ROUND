import "./globals.css";
import ManagerShell from "@/components/ManagerShell";

export const metadata = {
  title: "Skyline Student Association — Manager Portal",
  description: "Management dashboard for Skyline Student Association",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <ManagerShell>{children}</ManagerShell>
      </body>
    </html>
  );
}
