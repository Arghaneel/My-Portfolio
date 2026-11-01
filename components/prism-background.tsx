/**
 * Ambient "prism light" background: slow-drifting rainbow beams, a soft grey
 * haze and film grain, fixed behind every page. Pure CSS (see globals.css),
 * so it costs almost nothing and pauses for reduced-motion users.
 */
export default function PrismBackground() {
  return (
    <div className="prism-layer" aria-hidden="true">
      <div className="prism-haze prism-haze--a" />
      <div className="prism-haze prism-haze--b" />
      <div className="prism-beam prism-beam--a" />
      <div className="prism-beam prism-beam--b" />
      <div className="prism-beam prism-beam--c" />
      <div className="prism-grain" />
    </div>
  );
}
