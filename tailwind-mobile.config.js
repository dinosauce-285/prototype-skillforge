const desktopConfig = require('./tailwind-desktop.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
    ...desktopConfig,
    content: [
        "./payment_app/**/*.html",
        "./student_app/**/*.html"
    ],
    theme: {
        ...desktopConfig.theme,
        screens: { "sm":"9999px", "md":"9999px", "lg":"9999px", "xl":"9999px", "2xl":"9999px" },
    }
};
