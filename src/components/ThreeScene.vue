<template>
  <div class="flex">
    <BearFace class="bear-background" />

    <!-- Other bear components on top of the background -->
    <PinkBear :background="true" :cameraPosition="isBigMobile? 13: isBigTablet? 8: 6" :bodyPosition="{ x:-15, y:0, z: 0 }" class="bear-page"/>
    <PurpleBear :background="true" :cameraPosition="isBigMobile? 10: isBigTablet? 6: 4" :bodyPosition="{ x: -15,  y: 0, z: 0 }" class="bear-page"/>
    <BlueBear :background="true" :cameraPosition="isBigMobile? 13: isBigTablet? 8: 6" :bodyPosition="{ x: -18,  y: 0, z: 0 }" class="bear-page"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import PinkBear from './PinkBear.vue';
import PurpleBear from './PurpleBear.vue';
import BlueBear from './BlueBear.vue';
import PinkBlueBear from './PinkBlueBear.vue';
import BearFace from './BearFace.vue';
import { isBigTablet, isBigMobile } from '../utils/window-size';

const isBearFace = ref(true); // Controls which bear face is displayed
let switchInterval: number | undefined | any;

// Function to auto-toggle between BearFace and PixelBearFace
const toggleBearFace = () => {
  isBearFace.value = !isBearFace.value;
};

// Setup auto-switch interval
onMounted(() => {
  switchInterval = setInterval(() => {
    toggleBearFace();
  }, 3000); // Switch every 3 seconds
});

// Clear the interval when the component is unmounted
onUnmounted(() => {
  clearInterval(switchInterval);
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'); /* Pixel style font */

.flex {
  display: flex;
  flex-direction: row;
  height: 100vh;
  justify-content: center;
  align-items: center;
  position: relative; 
  z-index: 1;
  background: radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.8), rgba(135, 206, 250, 0.8), rgba(254, 0, 127, 0.993));
}

.bear-page {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.bear-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

nav {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    gap: 20px;
    background-color: #ff69b4; /* Bright pink background */
    padding: 10px 20px;
    color: white;
    border-radius: 0; /* No rounded corners for pixel style */
    font-family: 'Press Start 2P', sans-serif; /* Pixel style font */
    border: 4px solid #000000; /* Pixelated black border */
    box-shadow: 5px 5px 0 #000000, 10px 10px 0 #ffffff; /* Pixel-style shadow */
    z-index: 1000;
}

/* Style for the links inside the nav */
nav a {
    text-decoration: none;
    color: white;
    background-color: #000000; /* Dark background for links */
    padding: 10px 15px;
    border: 4px solid white; /* Pixel-style border for each link */
    box-shadow: 3px 3px 0 #ffffff, 6px 6px 0 #000000; /* Pixel shadow */
    font-size: 14px;
    transition: transform 0.2s ease-in-out;
}

/* Hover effect for the links */
nav a:hover {
    background-color: #ffcc00; /* Change background color to gold on hover */
    color: black;
    transform: translate(-3px, -3px); /* "Push" effect on hover */
    box-shadow: 3px 3px 0 #ffffff, 6px 6px 0 #000000;
}

/* Active link styling */
nav a:active {
    transform: translate(2px, 2px); /* Make the link appear pressed */
    box-shadow: 1px 1px 0 #ffffff, 2px 2px 0 #000000;
}
</style>
