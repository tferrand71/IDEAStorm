// src/utils/format.js

export function formatNumber(num) {
    if (num === undefined || num === null) return "0";
    if (num < 1000) return Math.floor(num).toString();

    // Suffixes : k=mille, M=Million, b=Milliard, a=Trillion (puis aa, ab...)
    const initialSuffixes = ["", "k", "M", "b", "a"];

    // On cherche la puissance de 1000
    const exponent = Math.floor(Math.log10(num) / 3);

    // Cas des suffixes standards (jusqu'à 'a' = Trillion)
    if (exponent < 5) {
        // toFixed(2) garde 2 décimales, replace retire le .00 inutile
        return (num / Math.pow(1000, exponent)).toFixed(2).replace(/\.00$/, '') + (initialSuffixes[exponent] || "");
    }

    // Cas des suffixes générés (aa, ab, ac...) pour les très grands nombres
    else {
        const offset = exponent - 5;
        const firstChar = String.fromCharCode(97 + Math.floor(offset / 26)); // a, b, c...
        const secondChar = String.fromCharCode(97 + (offset % 26));          // a, b, c...
        const suffix = firstChar + secondChar;

        return (num / Math.pow(1000, exponent)).toFixed(2).replace(/\.00$/, '') + " " + suffix;
    }
}