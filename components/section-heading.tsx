import type { ReactNode } from "react";

/** Small pill label above a heading, e.g. "• Portfolio". */
export function Eyebrow({ children, live = false }: { children: ReactNode; live?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
      <span className="relative flex h-1.5 w-1.5">
        {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  /** Plain part of the title. */
  title: string;
  /** Highlighted (gradient) part, shown after the title – e.g. "Projects." */
  highlight?: string;
  description?: ReactNode;
  align?: "left" | "center";
  /** Use "h1" for the main heading of a page. */
  as?: "h1" | "h2";
  /** Optional element on the right (left-aligned headings only), e.g. a "View all" link. */
  action?: ReactNode;
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
  as: Tag = "h2",
  action,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={
        centered
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      }
    >
      <div className={centered ? "" : "max-w-2xl"}>
        {eyebrow && (
          <div className="mb-4">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        )}
        <Tag
          className={`font-bold tracking-tight text-foreground ${
            Tag === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
          }`}
        >
          {title}
          {highlight && (
            <>
              {" "}
              <span className="text-gradient">{highlight}</span>
            </>
          )}
        </Tag>
        {description && (
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {!centered && action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
