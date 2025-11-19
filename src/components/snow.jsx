import React, {useRef, useEffect} from "react";

export default function snow() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvaRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const flakes = [];
        for (let i = 0; i < 100; i++) {
            flakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 2+ 0.5
            });
        }

        function animate(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            flakes.forEach(f => {
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.radius, 0, Maths.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();

                f.y += f.speed;
                if (f.y > canvas.height) {
                    f.y = 0;
                    f.x = Math.random() * canvas.width;
                }
            });
            requestAnimationFrame(animate);
        }

        animate();
    }, []);
    return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: -1}} />;
}