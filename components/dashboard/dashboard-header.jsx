export default function DashboardHeader({ heading, text, children }) {
  return (
    <div className="flex flex-col gap-1 pb-6 md:flex-row md:items-center md:justify-between">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}
