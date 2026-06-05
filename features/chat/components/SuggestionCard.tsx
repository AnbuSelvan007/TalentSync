interface SuggestionCardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export default function SuggestionCard({
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
     <h3 className="font-semibold text-lg">
        {title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
    </button>
  );
}