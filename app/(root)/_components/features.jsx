import {
  Sparkles,
  Clock,
  PenTool,
  Share2,
  Layers,
  Zap,
  BarChart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Features() {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary">
            <Zap className="mr-1 h-3.5 w-3.5" />
            <span>Powerful Features</span>
          </div>
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need for Perfect Emails
            </h2>
            <p className="text-muted-foreground md:text-xl">
              Our AI-powered platform makes email creation faster and smarter
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "AI-Powered Generation",
    description:
      "Create professional email templates with Google's Gemini AI in seconds.",
  },
  {
    icon: <PenTool className="h-10 w-10 text-primary" />,
    title: "Rich Text Editor",
    description:
      "Customize your templates with our intuitive rich text editor.",
  },
  {
    icon: <Layers className="h-10 w-10 text-primary" />,
    title: "Drag-and-Drop",
    description:
      "Easily rearrange content with our drag-and-drop functionality.",
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Save Time",
    description: "Reduce email writing time by up to 80% with AI templates.",
  },
  {
    icon: <Share2 className="h-10 w-10 text-primary" />,
    title: "Share Templates",
    description: "Collaborate with your team by sharing your email templates.",
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: "Performance Analytics",
    description:
      "Track email performance and optimize your communication strategy.",
  },
];

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-primary/10">{icon}</div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
