(() => {
  const sources = [
    "https://unpkg.com/three@0.160.0/build/three.min.js",
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"
  ];
  const timeoutMs = 4200;

  function markUnavailable() {
    document.querySelectorAll(".hero-3d, .match-3d").forEach((item) => item.classList.add("scene-unavailable"));
  }

  function loadExperience() {
    if (!globalThis.THREE) {
      markUnavailable();
      return;
    }
    const script = document.createElement("script");
    script.src = "three-experience.js";
    script.async = true;
    script.onerror = markUnavailable;
    document.head.appendChild(script);
  }

  function loadSource(index) {
    if (globalThis.THREE) {
      loadExperience();
      return;
    }
    if (index >= sources.length) {
      markUnavailable();
      return;
    }
    const script = document.createElement("script");
    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      script.remove();
      loadSource(index + 1);
    }, timeoutMs);

    script.src = sources[index];
    script.async = true;
    script.onload = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (globalThis.THREE) loadExperience();
      else loadSource(index + 1);
    };
    script.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      loadSource(index + 1);
    };
    document.head.appendChild(script);
  }

  loadSource(0);
})();
