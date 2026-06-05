import SuggestionCard from "./SuggestionCard";

interface ChatWelcomeProps {
  onSuggestionClick: (prompt: string) => void;
}

export default function ChatWelcome({
  onSuggestionClick,
}: ChatWelcomeProps) {
  const suggestions = [
    {
      title: "DSA Roadmap",
      description:
        "Generate a complete DSA preparation roadmap.",
      prompt:
        "Create a complete DSA roadmap for placements.",
    },
    {
      title: "Resume Review",
      description:
        "Get resume improvement suggestions.",
      prompt:
        "Review my resume and suggest improvements.",
    },
    {
      title: "Interview Prep",
      description:
        "Prepare for technical interviews.",
      prompt:
        "Give me frontend interview questions.",
    },
    {
      title: "Aptitude Practice",
      description:
        "Practice aptitude questions.",
      prompt:
        "Give me aptitude questions with solutions.",
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