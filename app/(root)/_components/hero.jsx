import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import AnimatedTooltip from "@/components/shared/AnimatedTooltip";

export default function Hero() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            <span>AI-Powered Email Templates</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Create Perfect Emails with <span className="text-primary">AI</span>
          </h1>
          <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl">
            Generate professional email templates in seconds with our AI-powered
            platform. Save time and improve your communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="px-8">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center mt-8">
            <AnimatedTooltip items={people} />
          </div>
          <p className="text-sm text-muted-foreground">
            Trusted by 10,000+ professionals worldwide
          </p>
        </div>
      </div>
    </section>
  );
}

const people = [
  {
    id: 1,
    name: "John Smith",
    designation: "Marketing Director",
    image: "/img-1.jpg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    designation: "Sales Manager",
    image: "/img-4.jpg",
  },
  {
    id: 3,
    name: "Michael Brown",
    designation: "CEO",
    image: "/img-2.jpg",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "Content Writer",
    image: "/img-5.jpg",
  },
  {
    id: 5,
    name: "David Wilson",
    designation: "Product Manager",
    image: "/img-6.jpg",
  },
];
