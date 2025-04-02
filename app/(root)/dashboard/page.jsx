import DashboardHeader from "@/components/dashboard/dashboard-header";
import EmailList from "@/components/dashboard/email-list";
import { emailTemplates } from "@/constants/email-templates";

export default function DashboardPage() {
  // In a real app, you would fetch this data from an API
  const emails = emailTemplates;
  const user = {
    email: "user@example.com",
    name: "John Doe",
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <DashboardHeader
        heading="Email Templates"
        text="Create and manage your AI-generated email templates."
      />
      <EmailList emails={emails} user={user} />
    </div>
  );
}
