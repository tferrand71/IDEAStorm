export const formatNumber = (num) => {
    // 1. Sécurité de base
    if (num === undefined || num === null) return "0";
    if (isNaN(num)) return "0";
    if (!isFinite(num)) return "INFINI ♾️"; // Si on dépasse 1e308

    // 2. Petits nombres (< 1000)
    // On affiche l'entier simple (ex: 950)
    if (Math.abs(num) < 1000) return Math.floor(num).toString();

    // 3. Cas Spéciaux (Noms Mythiques)
    // Googol = 1e100
    if (num >= 1e100 && num < 1e103) {
        return (num / 1e100).toFixed(2) + " Googol";
    }
    // Centillion = 1e303
    if (num >= 1e303) {
        return (num / 1e303).toFixed(2) + " Centillion";
    }

    // 4. Liste Complète des Suffixes Scientifiques (Short Scale)
    // Chaque suffixe correspond à une puissance de 10^3 (k=3, M=6, B=9...)
    const suffixes = [
        "", "k", "M", "B", "T",             // 0 à 12 (Base)
        "Qa", "Qi", "Sx", "Sp", "Oc", "No", // 15 à 30 (Quadrillion -> Nonillion)
        "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", // 33 à 60 (Decillion -> Novemdecillion)
        "Vg", "UVg", "DVg", "TVg", "QaVg", "QiVg", "SxVg", "SpVg", "OcVg", "NoVg", // 63 à 90 (Vigintillion...)
        "Tg", "UTg", "DTg", "TTg", "QaTg", "QiTg", "SxTg", "SpTg", "OcTg", "NoTg", // 93 à 120 (Trigintillion...)
        "Qag", "UQag", "DQag", "TQag", "QaQag", "QiQag", "SxQag", "SpQag", "OcQag", "NoQag", // 123 à 150 (Quadragintillion...)
        "Qig", "UQig", "DQig", "TQig", "QaQig", "QiQig", "SxQig", "SpQig", "OcQig", "NoQig", // 153 à 180 (Quinquagintillion...)
        "Sxg", "USxg", "DSxg", "TSxg", "QaSxg", "QiSxg", "SxSxg", "SpSxg", "OcSxg", "NoSxg", // 183 à 210 (Sexagintillion...)
        "Spg", "USpg", "DSpg", "TSpg", "QaSpg", "QiSpg", "SxSpg", "SpSpg", "OcSpg", "NoSpg", // 213 à 240 (Septuagintillion...)
        "Ocg", "UOcg", "DOcg", "TOcg", "QaOcg", "QiOcg", "SxOcg", "SpOcg", "OcOcg", "NoOcg", // 243 à 270 (Octogintillion...)
        "Nog", "UNog", "DNog", "TNog", "QaNog", "QiNog", "SxNog", "SpNog", "OcNog", "NoNog"  // 273 à 300 (Nonagintillion...)
    ];

    // 5. Calcul de l'index du suffixe
    // Math.log10(num) donne la puissance de 10 (ex: 1e6 -> 6). Divisé par 3 -> index du tableau.
    const suffixIndex = Math.floor(Math.log10(Math.abs(num)) / 3);

    // 6. Affichage
    if (suffixIndex < suffixes.length && suffixIndex >= 0) {
        const scaled = num / Math.pow(10, suffixIndex * 3);
        // Si le nombre est >= 100 (ex: 150 M), on n'affiche pas de virgule pour faire propre
        // Sinon (ex: 1.50 M), on affiche 2 décimales
        return scaled.toFixed(scaled >= 100 ? 0 : 2) + " " + suffixes[suffixIndex];
    }

    // 7. Fallback (Sécurité ultime)
    // Si on sort du tableau (ce qui ne devrait pas arriver avant l'infini), on passe en notation scientifique propre
    return num.toExponential(2).replace("+", "");
};