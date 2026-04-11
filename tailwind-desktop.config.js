/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./admin/**/*.html",
        "./instructor_web/**/*.html",
        "./payment_web/**/*.html",
        "./student_web/**/*.html",
        "./index.html"
    ],
    theme: {
        extend: {
            colors: {
                "primary":                  "#a53c00",
                "on-primary":               "#ffffff",
                "primary-container":        "#f26724",
                "on-primary-container":     "#501900",
                "primary-fixed":            "#ffdbce",
                "primary-fixed-dim":        "#ffb598",
                "on-primary-fixed":         "#370e00",
                "on-primary-fixed-variant": "#7e2c00",
                "inverse-primary":          "#ffb598",

                "secondary":                    "#914b2d",
                "on-secondary":                 "#ffffff",
                "secondary-container":          "#fda27e",
                "on-secondary-container":       "#77371a",
                "secondary-fixed":              "#ffdbce",
                "secondary-fixed-dim":          "#ffb598",
                "on-secondary-fixed":           "#370e00",
                "on-secondary-fixed-variant":   "#743418",

                "tertiary":                     "#785900",
                "on-tertiary":                  "#ffffff",
                "tertiary-container":           "#b98b00",
                "on-tertiary-container":        "#392900",
                "tertiary-fixed":               "#ffdf9e",
                "tertiary-fixed-dim":           "#fabd00",
                "on-tertiary-fixed":            "#261a00",
                "on-tertiary-fixed-variant":    "#5b4300",

                "error":              "#ba1a1a",
                "on-error":           "#ffffff",
                "error-container":    "#ffdad6",
                "on-error-container": "#93000a",

                "success":              "#1a6e3a",
                "on-success":           "#ffffff",
                "success-container":    "#c8f0d8",
                "on-success-container": "#0c3d20",

                "background":                   "#f9f9f9",
                "on-background":                "#1a1c1c",
                "surface":                      "#f9f9f9",
                "surface-bright":               "#f9f9f9",
                "surface-dim":                  "#dadada",
                "surface-variant":              "#e2e2e2",
                "surface-tint":                 "#a53c00",
                "surface-container-lowest":     "#ffffff",
                "surface-container-low":        "#f3f3f3",
                "surface-container":            "#eeeeee",
                "surface-container-high":       "#e8e8e8",
                "surface-container-highest":    "#e2e2e2",

                "on-surface":           "#1a1c1c",
                "on-surface-variant":   "#594138",
                "inverse-surface":      "#2f3131",
                "inverse-on-surface":   "#f1f1f1",

                "outline":          "#8d7166",
                "outline-variant":  "#e1bfb3",
            },

            borderRadius: {
                "DEFAULT": "0.25rem",
                "sm":      "0.375rem",
                "md":      "0.5rem",
                "lg":      "0.75rem",
                "xl":      "1rem",
                "2xl":     "1.5rem",
                "3xl":     "2rem",
                "4xl":     "2.5rem",
                "full":    "9999px",
            },

            fontFamily: {
                "headline": ["Plus Jakarta Sans", "sans-serif"],
                "body":     ["Manrope", "sans-serif"],
                "label":    ["Manrope", "sans-serif"],
                "accent":   ["Lexend", "sans-serif"],
            },

            fontSize: {
                "h1":      ["2rem",      { lineHeight: "1.15",  fontWeight: "900" }],
                "h2":      ["1.5rem",    { lineHeight: "1.2",   fontWeight: "700" }],
                "h3":      ["1.25rem",   { lineHeight: "1.375", fontWeight: "700" }],
                "h4":      ["1.125rem",  { lineHeight: "1.375", fontWeight: "700" }],
                "body":    ["1rem",      { lineHeight: "1.625" }],
                "caption": ["0.75rem",   { lineHeight: "1.5"   }],
                "label":   ["0.625rem",  { lineHeight: "1.25",  fontWeight: "900" }],
            },

            boxShadow: {
                "sm":    "0 4px 12px rgba(26, 28, 28, 0.04)",
                "md":    "0 12px 24px rgba(26, 28, 28, 0.06)",
                "lg":    "0 24px 40px rgba(26, 28, 28, 0.08)",
                "xl":    "0 40px 60px rgba(26, 28, 28, 0.10)",
                "brand": "0 8px 24px -4px rgba(165, 60, 0, 0.25)",
            },
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries')
    ]
};
