import React, { useEffect } from "react";

/**
 * Logo mockup gallery — also reachable as static public/logo-gallery.html.
 * Prefer query or hash routes when the static file is missing (e.g. old deploy, SPA-only server).
 */
export default function LogoGallery() {
  useEffect(() => {
    document.title = "Logo mockups — Wellness Tracker";
  }, []);

  return (
    <>
      <style>{`
        .lg-root {
          margin: 0;
          min-height: 100vh;
          background: #12141a;
          color: #e8e9ec;
          font-family: "DM Sans", system-ui, sans-serif;
          line-height: 1.5;
          padding: 32px 20px 64px;
          box-sizing: border-box;
        }
        .lg-root * { box-sizing: border-box; }
        .lg-root h1 {
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0 0 8px;
        }
        .lg-sub { color: #8b92a3; font-size: 0.9rem; max-width: 52ch; margin-bottom: 28px; }
        .lg-grid { display: grid; gap: 24px; max-width: 960px; margin: 0 auto; }
        @media (min-width: 720px) { .lg-grid { grid-template-columns: 1fr 1fr; } }
        .lg-card {
          background: #1a1d26;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #2a3040;
        }
        .lg-card h2 {
          margin: 0 0 6px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8b92a3;
        }
        .lg-card p.meta { margin: 0 0 20px; font-size: 0.8rem; color: #8b92a3; }
        .lg-swatch {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 24px;
          padding: 28px 16px;
          border-radius: 12px;
          background: #0d0f14;
          margin-bottom: 16px;
        }
        .lg-swatch.on-yellow { background: #2a2610; }
        .lg-label {
          font-size: 0.7rem;
          color: #8b92a3;
          text-align: center;
          width: 100%;
          margin: -8px 0 0;
        }
        .lg-tokens { display: flex; flex-wrap: wrap; gap: 12px; font-size: 0.75rem; font-family: ui-monospace, monospace; }
        .lg-tokens span {
          padding: 6px 10px;
          border-radius: 6px;
          background: #0d0f14;
          border: 1px solid #2a3040;
        }
        .lg-tokens .y { color: #f5e300; }
        .lg-tokens .k { color: #e8e9ec; }
        .lg-footer { max-width: 960px; margin: 40px auto 0; font-size: 0.8rem; color: #8b92a3; }
        .lg-footer code { font-size: 0.85em; }
      `}</style>
      <div className="lg-root">
        <h1>Logo mockups</h1>
        <p className="lg-sub">
          Electric yellow and ink black on a squircle. Two wordmarks: <strong>Wellness Tracker</strong> (WT) for this app, and{" "}
          <strong>Ash Reader</strong> (AR) for the reference design.
        </p>

        <div className="lg-grid">
          <div className="lg-card">
            <h2>WT — Wellness Tracker (512)</h2>
            <p className="meta">Large app icon / marketing size</p>
            <div className="lg-swatch">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="200" height="200" role="img" aria-label="WT Wellness Tracker logo large">
                <rect width="512" height="512" rx="112" fill="#f5e300" />
                <text x="256" y="228" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="800" fontSize="132" fill="#0f0f0f">WT</text>
                <text x="256" y="332" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="600" fontSize="34" fill="#0f0f0f" letterSpacing="0.28em">WELLNESS TRACKER</text>
              </svg>
              <span className="lg-label">200×200 preview (vector scales)</span>
            </div>
            <div className="lg-tokens">
              <span className="y">#f5e300</span>
              <span className="k">#0f0f0f</span>
            </div>
          </div>

          <div className="lg-card">
            <h2>AR — Ash Reader (512)</h2>
            <p className="meta">Reference sheet style (P6 inverted)</p>
            <div className="lg-swatch">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="200" height="200" role="img" aria-label="AR Ash Reader logo large">
                <rect width="512" height="512" rx="112" fill="#f5e300" />
                <text x="256" y="228" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="800" fontSize="132" fill="#0f0f0f">AR</text>
                <text x="256" y="332" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="600" fontSize="34" fill="#0f0f0f" letterSpacing="0.28em">ASH READER</text>
              </svg>
            </div>
            <div className="lg-tokens">
              <span className="y">#f5e300</span>
              <span className="k">#0f0f0f</span>
            </div>
          </div>

          <div className="lg-card">
            <h2>Home screen scale (~180)</h2>
            <p className="meta">Dense type — export PNGs with padding for iOS safe zone</p>
            <div className="lg-swatch">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="120" height="120" role="img" aria-label="WT small icon">
                <rect width="180" height="180" rx="40" fill="#f5e300" />
                <text x="90" y="82" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="800" fontSize="48" fill="#0f0f0f">WT</text>
                <text x="90" y="128" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="600" fontSize="11" fill="#0f0f0f" letterSpacing="0.2em">WELLNESS TRACKER</text>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="120" height="120" role="img" aria-label="AR small icon">
                <rect width="180" height="180" rx="40" fill="#f5e300" />
                <text x="90" y="82" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="800" fontSize="48" fill="#0f0f0f">AR</text>
                <text x="90" y="128" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="600" fontSize="11" fill="#0f0f0f" letterSpacing="0.2em">ASH READER</text>
              </svg>
            </div>
          </div>

          <div className="lg-card">
            <h2>Favicon scale (64)</h2>
            <p className="meta">Initials only — wordmark unreadable below ~128px</p>
            <div className="lg-swatch on-yellow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="WT favicon">
                <rect width="64" height="64" rx="14" fill="#f5e300" />
                <text x="32" y="40" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="800" fontSize="28" fill="#0f0f0f">WT</text>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="AR favicon">
                <rect width="64" height="64" rx="14" fill="#f5e300" />
                <text x="32" y="40" textAnchor="middle" fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="800" fontSize="28" fill="#0f0f0f">AR</text>
              </svg>
            </div>
          </div>
        </div>

        <footer className="lg-footer">
          <strong>Ways to open this page:</strong>{" "}
          <code>?gallery=logos</code> or <code>#logo-gallery</code> on your deployed URL (works after one deploy);{" "}
          <code>/logo-gallery.html</code> from <code>public/</code> when the dev server or host serves static files;{" "}
          local dev: <code>http://localhost:3000/logo-gallery.html</code> or <code>http://localhost:3000/?gallery=logos</code>.
        </footer>
      </div>
    </>
  );
}
