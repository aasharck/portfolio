/**
 * First-load intro: a counter runs 0 → 100 with a progress line, then the screen
 * lifts away to reveal the hero. Pure CSS (no JavaScript needed, it can't get
 * stuck), never blocks clicks, shown once per visit, and skipped under reduced
 * motion. The counter uses an animated @property integer.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <p className="intro-top caps">
        <span>Aashar CK</span>
        <span>Full-stack &amp; AI engineer</span>
        <span>Dubai, UAE</span>
      </p>
      <p className="intro-name">
        Aashar <em>CK</em>
      </p>
      <div className="intro-bottom">
        <span className="intro-count" />
        <span className="caps intro-note">Loading the record</span>
      </div>
      <span className="intro-line" />
    </div>
  );
}
