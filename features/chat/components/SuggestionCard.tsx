import { LucideIcon } from "lucide-react";
interface SuggestionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function SuggestionCard({
  icon: Icon,
  title,
  description,
  onClick,
}: SuggestionCardProps) {
  return (
    <button
      onClick={onClick}
      className="
group
rounded-3xl
border
bg-card/50
backdrop-blur
p-6
text-left
transition-all
duration-300
hover:-translate-y-1
hover:shadow-xl
"
    >
      <Icon className="mb-3 h-6 w-6" />
     <h3 className="font-semibold text-lg">
        {title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
    </button>
  );
}