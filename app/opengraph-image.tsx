import { ImageResponse } from "next/og";

// Preview image shown when the site link is shared on LinkedIn, WhatsApp, X, Slack, etc.
export const alt = "Arghaneel Das — Computer Science Student & Applied AI Intern";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const chips = ["Applied AI Intern · DeepAgentLabs", "Vice-President · OSCode", "CGPA 9.28"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 85% 0%, rgba(74,222,128,0.22), transparent 55%), #0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#111111",
              border: "1px solid rgba(74,222,128,0.5)",
              color: "#4ade80",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            AD
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa" }}>Portfolio</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>
            Arghaneel Das<span style={{ color: "#4ade80" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 36, color: "#a1a1aa" }}>
            Computer Science Student · Atria Institute of Technology
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                fontSize: 26,
                padding: "10px 22px",
                borderRadius: 999,
                background: "#111111",
                border: "1px solid #262626",
                color: "#e4e4e7",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
