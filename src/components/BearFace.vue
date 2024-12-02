<template>
    <div v-if="!isHidden" class="bear-face-container">
      <canvas ref="bearCanvas"></canvas>
      <button @click="toggleComponent" class="pixel-button">Enter</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  const bearCanvas = ref<HTMLCanvasElement | null>(null);
  const isHidden = ref(false); // Controls the visibility of the entire component
  
  // Function to hide the entire component
  const toggleComponent = () => {
    isHidden.value = true; // Hides the component when the button is clicked
  };
  
  onMounted(() => {
    const canvas = bearCanvas.value;
  
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.6;
  
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        const drawBearFace = () => {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 1.9;
  
          const faceRadius = canvas.height / 2.5;
          const strokeFaceRadius = canvas.height / 2.58;

          const earRadius = faceRadius * 0.45;
          const eyeRadius = faceRadius * 0.18;
          const snoutRadius = faceRadius * 0.3;
          const smallSnoutRadius = faceRadius * 0.275;
          const noseRadius = snoutRadius * 0.35;
          const smallNoseRadius = snoutRadius * 0.32;

  
          // Draw half of the bear's face with stroke style
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, canvas.width / 2, canvas.height); // Left half for stroke
          ctx.clip(); // Clip left half
  
          // Ears (Stroke)
          ctx.lineWidth = 15;
          ctx.strokeStyle = '#000000';
          ctx.beginPath();
          ctx.arc(centerX - faceRadius * 0.85, centerY - strokeFaceRadius * 0.8, earRadius, 0, Math.PI * 2, true); // Left ear
          ctx.stroke();
  
          ctx.beginPath();
          ctx.arc(centerX + faceRadius * 0.85, centerY - faceRadius * 0.8, earRadius, 0, Math.PI * 2, true); // Right ear
          ctx.stroke();
  
          // Head (Stroke)
          ctx.lineWidth = 15;
          ctx.beginPath();
          ctx.arc(centerX, centerY, strokeFaceRadius, 0, Math.PI * 2, true); // Circle for the head
          ctx.stroke();
  
          // Eyes (Stroke)
          ctx.lineWidth = 15;
          ctx.beginPath();
          ctx.arc(centerX - faceRadius * 0.4, centerY - faceRadius * 0.2, eyeRadius, 0, Math.PI * 2, true); // O eye
          ctx.stroke();
  
          ctx.beginPath();
          // X eye
          ctx.moveTo(centerX + faceRadius * 0.2, centerY - faceRadius * 0.3);  
          ctx.lineTo(centerX + faceRadius * 0.5, centerY - faceRadius * 0.05);
          ctx.moveTo(centerX + faceRadius * 0.5, centerY - faceRadius * 0.3);  
          ctx.lineTo(centerX + faceRadius * 0.2, centerY - faceRadius * 0.05);
          ctx.stroke();
  
          // Snout (Stroke)
          ctx.beginPath();
          ctx.ellipse(centerX, centerY + faceRadius * 0.4, smallSnoutRadius * 1.5, smallSnoutRadius, 0, 0, Math.PI * 2);
          ctx.stroke();
  
          ctx.beginPath();
          ctx.arc(centerX, centerY + faceRadius * 0.3, smallNoseRadius, 0, Math.PI * 2, true);
          ctx.stroke();
          ctx.restore();
  
          // Draw half of the bear's face with fill (colored) style
          ctx.save();
          ctx.beginPath();
          ctx.rect(canvas.width / 2, 0, canvas.width / 2, canvas.height); // Right half for color
          ctx.clip(); // Clip right half
  
          // Ears (Color)
          ctx.fillStyle = '#FF69B4'; // Pink color
          ctx.beginPath();
          ctx.arc(centerX - faceRadius * 0.85, centerY - faceRadius * 0.8, earRadius, 0, Math.PI * 2, true); // Left ear
          ctx.fill();
  
          ctx.beginPath();
          ctx.arc(centerX + faceRadius * 0.85, centerY - faceRadius * 0.8, earRadius, 0, Math.PI * 2, true); // Right ear
          ctx.fill();
  
          // Head (Color)
          ctx.beginPath();
          ctx.arc(centerX, centerY, faceRadius, 0, Math.PI * 2, true); // Circle for the head
          ctx.fill();
  
          // Eyes (Color)
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(centerX - faceRadius * 0.4, centerY - faceRadius * 0.2, eyeRadius, 0, Math.PI * 2, true); // O eye
          ctx.fill();
  
          ctx.lineWidth = 15;
          ctx.beginPath();
          // X eye
          ctx.moveTo(centerX + faceRadius * 0.2, centerY - faceRadius * 0.3);  
          ctx.lineTo(centerX + faceRadius * 0.5, centerY - faceRadius * 0.05);
          ctx.moveTo(centerX + faceRadius * 0.5, centerY - faceRadius * 0.3);  
          ctx.lineTo(centerX + faceRadius * 0.2, centerY - faceRadius * 0.05);
          ctx.strokeStyle = '#000000';
          ctx.stroke();
  
          // Snout (Color)
          ctx.fillStyle = '#F0E68C'; // Snout color
          ctx.beginPath();
          ctx.ellipse(centerX, centerY + faceRadius * 0.4, snoutRadius * 1.5, snoutRadius, 0, 0, Math.PI * 2);
          ctx.fill();
  
          ctx.fillStyle = '#000000'; // Nose color
          ctx.beginPath();
          ctx.arc(centerX, centerY + faceRadius * 0.3, noseRadius * 1.2, 0, Math.PI * 2, true);
          ctx.fill();
          ctx.restore();
        };
  
        drawBearFace();
      }
    }
  });
  </script>
  
  <style scoped>
  .bear-face-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    background: radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.8), rgba(135, 206, 250, 0.8), rgba(254, 0, 127, 0.993));
  }
  
  canvas {
    display: block;
    width: 100%;
    height: auto;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 18px;
    background-color: #ff69b4;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .pixel-button {
    font-family: 'Press Start 2P', sans-serif; /* Pixel-style font */
    font-size: 18px;
    padding: 15px 40px;
    background-color: #ff69b4; /* Bright pink background */
    color: white;
    border: 4px solid #000000; /* Black pixelated border */
    box-shadow: 5px 5px 0 #000000, 10px 10px 0 #ffffff; /* Pixel-style shadow */
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
  }
  
  /* Hover effect for the button */
  .pixel-button:hover {
    background-color: #ffcc00; /* Change background to gold on hover */
    color: black;
    transform: translate(-3px, -3px); /* Pixel push effect */
    box-shadow: 5px 5px 0 #ffffff, 10px 10px 0 #000000;
  }
  </style>
  