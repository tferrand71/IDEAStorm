import React, { useState, useEffect } from "react";

export default function DraggableMedia({ item, index, updatePosition }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newTop = e.clientY - 50;
        const newLeft = e.clientX - 50;

        updatePosition(index, { top: newTop + "px", left: newLeft + "px" });
    };

    // Permet de continuer le drag même quand on sort de l'image
    useEffect(() => {
        const handleMouseUpGlobal = () => setIsDragging(false);
        document.addEventListener("mouseup", handleMouseUpGlobal);

        return () => document.removeEventListener("mouseup", handleMouseUpGlobal);
    }, []);

    const isVideo = item.src?.endsWith(".mp4"); // ✔️ corrigé

    return (
        <div
            style={{
                position: "absolute",
                top: item.top,
                left: item.left,
                cursor: "grab",
                userSelect: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
        >
            {isVideo ? (
                <video
                    src={item.src}
                    width={item.width}
                    autoPlay
                    loop
                    muted
                />
            ) : (
                <img
                    src={item.src}
                    width={item.width}
                    draggable={false}
                />
            )}
        </div>
    );
}
