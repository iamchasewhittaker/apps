import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LogoGallery from "./LogoGallery";

function shouldShowLogoGallery() {
  if (typeof window === "undefined") return false;
  const { pathname, hash, search } = window.location;
  if (pathname.endsWith("/logo-gallery") || pathname.endsWith("/logo-gallery.html")) return true;
  if (hash === "#logo-gallery" || hash === "#/logo-gallery") return true;
  return new URLSearchParams(search).get("gallery") === "logos";
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(shouldShowLogoGallery() ? <LogoGallery /> : <App />);
