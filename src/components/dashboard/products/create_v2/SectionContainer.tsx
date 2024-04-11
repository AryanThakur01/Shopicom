import { twMerge } from "tailwind-merge";

interface ISectionContainer {
  title: string;
  children: React.ReactNode;
  ctaFunction?: () => void;
  ctaText?: string;
  className?: string;
  color?: string;
}
const SectionContainer: React.FC<ISectionContainer> = ({
  title,
  children,
  ctaFunction,
  ctaText,
  className,
  color,
}) => {
  return (
    <div
      className={twMerge(
        "bg-muted/30 rounded-md overflow-hidden shadow-inner shadow-background/70",
        className,
      )}
    >
      <div className="flex justify-between items-center p-2 px-4 min-h-16">
        <h3 className="text-lg font-bold">{title}</h3>
        {ctaFunction && (
          <button
            type="button"
            onClick={ctaFunction}
            className="bg-success p-2 w-32 rounded"
          >
            {ctaText}
          </button>
        )}
        {color && (
          <div
            className="h-8 w-8 rounded-full bg-transparent border border-border"
            style={{ backgroundColor: color }}
          />
        )}
      </div>
      <hr className="border-border/30" />
      <div className="p-4">{children}</div>
    </div>
  );
};

export default SectionContainer;
