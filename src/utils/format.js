export function formatNumber(num) {
    // 1. Sécurité absolue : Si le nombre est invalide, on affiche "0" (ou une valeur par défaut)
    if (num === undefined || num === null) return "0";

    const value = Number(num);

    // Si le calcul a échoué (NaN), on renvoie "0" proprement pour l'affichage
    if (isNaN(value)) return "0";

    // Si le nombre dépasse les limites de l'univers (Infini)
    if (!isFinite(value)) return "INFINI";

    // Si c'est petit, affichage normal
    if (value < 1000) return Math.floor(value).toString();

    const initialSuffixes = ["", "k", "M", "b", "a"];

    // Calcul de la puissance
    const exponent = Math.floor(Math.log10(value) / 3);

    if (exponent < 5) {
        // k, M, b, a
        return (value / Math.pow(1000, exponent)).toFixed(2).replace(/\.00$/, '') + (initialSuffixes[exponent] || "");
    } else {
        // aa, ab, ac...
        const offset = exponent - 5;
        const firstChar = String.fromCharCode(97 + Math.floor(offset / 26));
        const secondChar = String.fromCharCode(97 + (offset % 26));
        const suffix = " " + firstChar + secondChar;

        return (value / Math.pow(1000, exponent)).toFixed(2).replace(/\.00$/, '') + suffix;
    }
}