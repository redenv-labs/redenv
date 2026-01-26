"use client";
import { cn } from "@heroui/react";
import React, { useEffect, useRef } from "react";

interface Beam {
  x: number;
  y: number;
  z: number;
  speed: number;
  length: number;
  axis: "x" | "z";
}

export const GridBeams = ({
  className,
  gridSize = 40,
  beamCount = 30,
  color = "#ff3333",
}: {
  className?: string;
  gridSize?: number;
  beamCount?: number;
  color?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const perspective = 300;
    const gridY = 100; // Horizon offset
    const activeBeams: Beam[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const project = (x: number, y: number, z: number) => {
      const scale = perspective / (perspective + z);
      const px = x * scale + width / 2;
      const py = y * scale + height / 2;
      return { x: px, y: py, scale };
    };

    const drawGrid = (offsetZ: number) => {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      // Draw vertical lines (Z-axis)
      for (let x = -width; x < width; x += gridSize) {
        ctx.beginPath();
        const start = project(x, gridY, 0);
        const end = project(x, gridY, 2000);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }

      // Draw horizontal lines (X-axis) - moving towards camera
      const loopZ = 2000;
      const modOffset = offsetZ % gridSize;

      for (let z = 0; z < loopZ; z += gridSize) {
        const currentZ = z - modOffset;
        if (currentZ < 0) continue;

        ctx.beginPath();
        const start = project(-width, gridY, currentZ);
        const end = project(width, gridY, currentZ);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    };

    const spawnBeam = () => {
      if (activeBeams.length >= beamCount) return;

      // Spawn randomly on X or Z alignment
      const axis = Math.random() > 0.5 ? "x" : "z";
      activeBeams.push({
        x:
          Math.floor((Math.random() - 0.5) * (width / gridSize) * 2) * gridSize,
        y: gridY,
        z: Math.random() * 2000,
        speed: 5 + Math.random() * 5,
        length: 100 + Math.random() * 200,
        axis,
      });
    };

    let globalZ = 0;

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Static Grid (moving forward)
      globalZ += 1;
      drawGrid(globalZ);

      // 2. Spawn and Draw Beams
      if (Math.random() > 0.9) spawnBeam();

      activeBeams.forEach((beam, i) => {
        if (beam.axis === "z") {
          beam.z -= beam.speed; // Move towards camera

          if (beam.z < -beam.length) {
            activeBeams.splice(i, 1);
            return;
          }

          const start = project(beam.x, beam.y, beam.z);
          const end = project(beam.x, beam.y, beam.z + beam.length);

          const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
          grad.addColorStop(0, color);
          grad.addColorStop(1, "transparent");

          ctx.strokeStyle = grad;
          ctx.lineWidth = 3 * start.scale;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();

          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          // X axis movement? Maybe stick to Z for flow
          // Lets make X axis beams stick to a Z plane and move X?
          // Simplifying: Just Z axis beams look like "Data Highway"
          // Lets convert X active beams to Z for now to keep it uniform speed feeling
          beam.axis = "z";
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    resizeCanvas();
    update();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridSize, beamCount, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "w-full h-full absolute inset-0 z-0 pointer-events-none",
        className,
      )}
    />
  );
};
