import React from "react";
import DraggableMedia from "./DraggableMedia";

export default function MediaOverlay({ media, setMedia, editorMode }) {

    const updatePosition = (index, newPos) => {
        const updated = [...media];
        updated[index] = { ...updated[index], ...newPos };
        setMedia(updated);
        localStorage.setItem("mediaPositions", JSON.stringify(updated));
    };

    return (
        <>
            {media.map((m, i) =>
                editorMode ? (
                    <DraggableMedia
                        key={i}
                        item={m}
                        index={i}
                        updatePosition={updatePosition}
                    />
                ) : (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: m.top,
                            left: m.left,
                        }}
                    >
                        {m.src.endsWith(".mp4") ? (
                            <video src={m.src} width={m.width} autoPlay loop muted />
                        ) : (
                            <img src={m.src} width={m.width} />
                        )}
                    </div>
                )
            )}
        </>
    );
}
