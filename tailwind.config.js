/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "on-tertiary-fixed": "#1b1b1b",
        "on-primary-fixed-variant": "#474747",
        "tertiary-fixed": "#e2e2e2",
        "on-secondary-fixed-variant": "#404752",
        "outline": "#7e7576",
        "tertiary-fixed-dim": "#c6c6c6",
        "on-primary-container": "#848484",
        "on-background": "#191c1e",
        "on-error-container": "#93000a",
        "on-tertiary": "#ffffff",
        "secondary-fixed-dim": "#c0c7d3",
        "surface-container-lowest": "#ffffff",
        "surface-container": "#edeef0",
        "inverse-on-surface": "#f0f1f3",
        "on-secondary": "#ffffff",
        "on-tertiary-fixed-variant": "#474747",
        "surface-container-low": "#f3f4f6",
        "on-secondary-container": "#5e6570",
        "error": "#ba1a1a",
        "on-secondary-fixed": "#151c25",
        "surface-tint": "#5e5e5e",
        "secondary-fixed": "#dce3f0",
        "on-primary-fixed": "#1b1b1b",
        "surface-bright": "#f8f9fb",
        "on-surface-variant": "#4c4546",
        "on-error": "#ffffff",
        "on-tertiary-container": "#848484",
        "tertiary-container": "#1b1b1b",
        "primary-fixed": "#e2e2e2",
        "surface-dim": "#d9dadc",
        "inverse-primary": "#c6c6c6",
        "outline-variant": "#cfc4c5",
        "primary-container": "#1b1b1b",
        "tertiary": "#000000",
        "surface-container-highest": "#e1e2e4",
        "error-container": "#ffdad6",
        "on-surface": "#191c1e",
        "surface": "#f8f9fb",
        "secondary-container": "#dce3f0",
        "secondary": "#585f6a",
        "primary": "#000000",
        "primary-fixed-dim": "#c6c6c6",
        "background": "#f8f9fb",
        "surface-variant": "#e1e2e4",
        "inverse-surface": "#2e3132",
        "on-primary": "#ffffff",
        "surface-container-high": "#e7e8ea"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "spacing": {
        "md": "16px",
        "margin": "32px",
        "lg": "24px",
        "sm": "8px",
        "2xl": "64px",
        "unit": "4px",
        "xs": "4px",
        "gutter": "24px",
        "xl": "40px"
      },
      "fontFamily": {
        "display": ["Inter"],
        "label-caps": ["Inter"],
        "caption": ["Inter"],
        "h3": ["Inter"],
        "h2": ["Inter"],
        "h1": ["Inter"],
        "body-md": ["Inter"],
        "body-lg": ["Inter"]
      },
      "fontSize": {
        "display": ["40px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "caption": ["12px", {"lineHeight": "1.4", "fontWeight": "400"}],
        "h3": ["18px", {"lineHeight": "1.5", "fontWeight": "600"}],
        "h2": ["24px", {"lineHeight": "1.4", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "h1": ["32px", {"lineHeight": "1.3", "letterSpacing": "-0.02em", "fontWeight": "600"}],
        "body-md": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
