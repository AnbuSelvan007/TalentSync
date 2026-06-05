import ThemeToggle from "@/components/shared/ThemeToggle";

export default function Navbar() {
  return (
    <header className="h-16 border-b backdrop-blur-xl bg-background/70 px-6 flex items-center justify-between">
      <div>
  <h2 className="font-semibold">
    TalentSync AI
  </h2>

  <p className="text-xs text-muted-foreground">
    AI Placement Assistant
  </p>
</div>

      <ThemeToggle />
    </header>
  );
}