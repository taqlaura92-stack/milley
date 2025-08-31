// Aseguramos que el script se ejecute solo cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("corazon");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let w, h;

    function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let mouseX = w / 2, mouseY = h / 2;
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // --- CONFIGURACIÓN PRINCIPAL ---
    const coloresLED = ["#FF0077", "#FF3399", "#FFB6C1", "#66FFFF", "#00CCFF", "#99FF33", "#FFFF00"];
    const colorCorazonGrande = "#8B0000"; // 👈 NUEVO: Color rojo para el corazón grande
    const numCorazonesPequeños = 250;
    const porcentajeAtraccion = 0.2;
    const distanciaActivacion = 250;
    const escalaFormacion = 20;

    class PequeñoCorazon {
        constructor() {
            this.reset();
            this.size = Math.random() * 6 + 3;
            this.color = coloresLED[Math.floor(Math.random() * coloresLED.length)];
            this.originalOpacity = Math.random() * 0.7 + 0.3;
            this.swaySpeed = Math.random() * 0.05 + 0.01;
            this.isAttracted = false;
        }

        reset() {
            this.x = Math.random() * w;
            this.y = -Math.random() * h;
            this.z = Math.random() * 1.5 + 0.5;
            this.speedY = (Math.random() * 0.8 + 0.4) * (this.z / 2);
            this.swayOffset = Math.random() * Math.PI * 2;
            this.isAttracted = false;
        }

        update(targetFormacion = false, formacionX = 0, formacionY = 0) {
            if (targetFormacion && this.isAttracted) {
                this.x += (formacionX - this.x) * 0.08;
                this.y += (formacionY - this.y) * 0.08;
            } else {
                this.y += this.speedY;
                this.x += Math.sin(this.swayOffset + Date.now() * this.swaySpeed) * 0.3;
                if (this.y > h + this.size) {
                    this.reset();
                }
            }
        }

        draw() {
            const pulse = Math.sin(Date.now() * 0.005 + this.x) * 0.1 + 1;
            const currentSize = this.size * this.z * pulse;
            const currentOpacity = this.originalOpacity * this.z;
            
            // 👈 CAMBIO AQUÍ: Usamos el color rojo si el corazón está atraído, sino, su color normal
            const currentColor = this.isAttracted ? colorCorazonGrande : this.color;
            
            dibujarCorazon(this.x, this.y, currentSize, currentColor, currentOpacity, 15);
        }
    }

    const corazonesPequeños = [];
    for (let i = 0; i < numCorazonesPequeños; i++) {
        corazonesPequeños.push(new PequeñoCorazon());
    }

    function dibujarCorazon(x, y, size, color, opacity, glow = 0) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.shadowBlur = glow;
        ctx.shadowColor = color;
        ctx.translate(x, y);
        ctx.scale(size / 10, size / 10);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(5, -10, 10, -10, 10, 0);
        ctx.bezierCurveTo(10, 4, 0, 12, 0, 12);
        ctx.bezierCurveTo(0, 12, -10, 4, -10, 0);
        ctx.bezierCurveTo(-10, -10, -5, -10, 0, 0);
        ctx.fill();
        ctx.restore();
    }

    function animar() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        const distToMouse = Math.hypot(mouseX - w / 2, mouseY - h / 2);
        const mouseClose = distToMouse < distanciaActivacion;

        if (!mouseClose) {
            corazonesPequeños.forEach(corazon => corazon.isAttracted = false);
        } else {
            const numAttracted = Math.floor(numCorazonesPequeños * porcentajeAtraccion);
            for (let i = 0; i < numAttracted; i++) {
                corazonesPequeños[i].isAttracted = true;
            }
            for (let i = numAttracted; i < numCorazonesPequeños; i++) {
                corazonesPequeños[i].isAttracted = false;
            }
        }

        let formacionHeartPoints = [];
        if (mouseClose) {
            const heartCurveSteps = 50;
            for (let i = 0; i < heartCurveSteps; i++) {
                const t = (i / heartCurveSteps) * Math.PI * 2;
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                formacionHeartPoints.push({
                    x: w / 2 + hx * escalaFormacion,
                    y: h / 2 + hy * escalaFormacion
                });
            }
        }

        let currentPointIndex = 0;
        corazonesPequeños.forEach(corazon => {
            let targetX = corazon.x;
            let targetY = corazon.y;

            if (corazon.isAttracted && mouseClose && formacionHeartPoints.length > 0) {
                const point = formacionHeartPoints[currentPointIndex % formacionHeartPoints.length];
                targetX = point.x;
                targetY = point.y;
                currentPointIndex++;
            }

            corazon.update(corazon.isAttracted && mouseClose, targetX, targetY);
            corazon.draw();
        });
        
        requestAnimationFrame(animar);
    }

    animar();
});