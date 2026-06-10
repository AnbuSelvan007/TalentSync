import SuggestionCard from "./SuggestionCard";
import {
  BookOpen,
  FileText,
  Brain,
  Target,
} from "lucide-react";
interface ChatWelcomeProps {
  onSuggestionClick: (prompt: string) => void;
}

export default function ChatWelcome({
  onSuggestionClick,
}: ChatWelcomeProps) {
 const suggestions = [
  {
    icon: BookOpen,
    title: "DSA Roadmap",
    description:
      "Generate a placement roadmap.",
    prompt:
      "Create a complete DSA roadmap.",
  },

  {
    icon: FileText,
    title: "Resume Review",
    description:
      "Improve ATS score.",
    prompt:
      "Review my resume.",
  },

  {
    icon: Target,
    title: "Mock Interview",
    description:
      "Practice interviews.",
    prompt:
      "Conduct a frontend interview.",
  },

  {
    icon: Brain,
    title: "Aptitude Practice",
    description:
      "Practice aptitude.",
    prompt:
      "Give aptitude questions.",
  },
];

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="max-w-5xl text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          👋 Welcome to TalentSync AI
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Your AI-powered placement assistant.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {suggestions.map((item) => (
            <SuggestionCard
              key={item.title}
              title={item.title}
              icon={item.icon}
              description={item.description}
              onClick={() =>
                onSuggestionClick(item.prompt)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}