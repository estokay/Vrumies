let currentMode = null;
let squareScriptPromise = null;

export function loadSquareSDK(mode = "sandbox") {
  // ✅ If same mode already loaded → reuse
  if (squareScriptPromise && currentMode === mode && window.Square) {
    return squareScriptPromise;
  }

  // 🔥 Mode changed → reset everything
  currentMode = mode;
  squareScriptPromise = null;

  squareScriptPromise = new Promise((resolve, reject) => {
    // Remove existing script
    const existingScript = document.querySelector(
      "script[src*='squarecdn.com']"
    );

    if (existingScript) {
      existingScript.remove();
      window.Square = undefined;
    }

    const script = document.createElement("script");

    script.src =
      mode === "production"
        ? "https://web.squarecdn.com/v1/square.js"
        : "https://sandbox.web.squarecdn.com/v1/square.js";

    script.async = true;

    script.onload = () => {
      if (window.Square) {
        resolve(window.Square);
      } else {
        reject(new Error("Square SDK loaded but unavailable"));
      }
    };

    script.onerror = () => reject(new Error("Failed to load Square SDK"));

    document.body.appendChild(script);
  });

  return squareScriptPromise;
}