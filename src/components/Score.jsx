import React from "react";

export default function Score({ score }) {
    const format = (n) => n.toLocaleString("fr-FR");

    return <h2>Score : {format(score)}</h2>;
}
