import { skillCategories, type Skill } from "@/lib/data/skills";
import SkillIcon from "@/components/skill-icon";

/** Every skill once, in the order it appears in lib/data/skills.ts. */
function allSkills(): Skill[] {
  const seen = new Set<string>();
  const out: Skill[] = [];
  for (const cat of skillCategories) {
    for (const s of cat.skills) {
      if (seen.has(s.name)) continue;
      seen.add(s.name);
      out.push(s);
    }
  }
  return out;
}

function Row({ skills, reverse = false }: { skills: Skill[]; reverse?: boolean }) {
  // Two copies so translating by -50% loops seamlessly.
  const items = [...skills, ...skills];
  return (
    <div className="marquee-mask overflow-hidden">
      <ul className={`marquee-track flex w-max gap-3 py-1.5 ${reverse ? "marquee-track--reverse" : ""}`}>
        {items.map((s, i) => (
          <li
            key={`${s.name}-${i}`}
            aria-hidden={i >= skills.length || undefined}
            className="group flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <SkillIcon
              skill={s}
              size={18}
              className="grayscale opacity-80 transition group-hover:grayscale-0 group-hover:opacity-100"
            />
            <span className="whitespace-nowrap">{s.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Two rows of technology pills drifting in opposite directions. Hover pauses them. */
export default function TechMarquee() {
  const skills = allSkills();
  const half = Math.ceil(skills.length / 2);
  return (
    <div className="space-y-3">
      <Row skills={skills.slice(0, half)} />
      <Row skills={skills.slice(half)} reverse />
    </div>
  );
}
