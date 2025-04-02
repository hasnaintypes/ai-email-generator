import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export const metadata = {
  title: "Dashboard | Mail Genius",
  description: "Manage your AI-powered email templates",
};

export default function DashboardLayout({ children }) {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DashboardShell>{children}</DashboardShell>
      </ThemeProvider>
    </div>
  );
}
