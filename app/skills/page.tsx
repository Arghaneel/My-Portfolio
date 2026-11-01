import { redirect } from "next/navigation";

// Skills are shown in the "Technological Foundation" section on the home page – keep old links working.
export default function SkillsPage() {
  redirect("/#stack");
}
