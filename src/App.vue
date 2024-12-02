<template>
  <div id="app">
    <nav v-show="isNavVisible">
      <router-link to="/3d-bear-arts/leather">LV</router-link>
      <router-link to="/3d-bear-arts/pop-art">Pop MouseMove</router-link>
      <!-- <router-link to="/3d-bear-arts/pop-art-bear">Pop-Bear</router-link> -->
      <router-link to="/3d-bear-arts/pop-art-bear-3">Pop Art</router-link>
      <router-link to="/3d-bear-arts/machine">Machine</router-link>
      <router-link to="/3d-bear-arts/water">Water</router-link>
      <router-link to="/3d-bear-arts/ghost-bear">Pumpkin</router-link>
      <router-link to="/3d-bear-arts/white-ghost-bear">Ghost</router-link>
      <router-link to="/3d-bear-arts/coffee">Coffee</router-link>
      <router-link to="/3d-bear-arts/bears">Bears</router-link>
      <router-link to="/3d-bear-arts/money">Money</router-link>
      <router-link to="/3d-bear-arts/santa">Santa</router-link>
      <router-link to="/3d-bear-arts/snowman">Snowman</router-link>
      <router-link to="/3d-bear-arts/">Duck</router-link>


      <!-- <router-link to="/3d-bear-arts">Home</router-link>
      <router-link to="/3d-bear-arts/half">HalfTranparent</router-link>
      <router-link to="/3d-bear-arts/sliver">Mirror</router-link>
      <router-link to="/3d-bear-arts/metal">Leather</router-link>
      <router-link to="/3d-bear-arts/pop-art">Pop</router-link>
      <router-link to="/3d-bear-arts/pop-art-bear">Pop-Bear</router-link>
      <router-link to="/3d-bear-arts/pop-art-bear-3">Pop-Bear-3</router-link> -->

       <!-- <router-link to="/3d-bear-arts/halfTransparent">HalfTranparent</router-link>
      <router-link to="/3d-bear-arts/bluePink">BluePink</router-link>
      <router-link to="/3d-bear-arts/diamond">Diamond</router-link>
      <router-link to="/3d-bear-arts/pink">Pink</router-link>
      <router-link to="/3d-bear-arts/purple">Purple</router-link>
      <router-link to="/3d-bear-arts/glass">Glass</router-link> -->
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isNavVisible = ref(false);
  function handleMouseMove(event: MouseEvent) {
  if (event.clientY < 100) {
    isNavVisible.value = true;
  } else {
    isNavVisible.value = false;
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'); /* Pixel style font */

#app {
  width: 100%;
}

nav {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  gap: 14px;
  background-color: #ff69b4; /* Bright pink background */
  padding: 10px 20px;
  color: white;
  border-radius: 0; /* No rounded corners for pixel style */
  font-family: 'Press Start 2P', sans-serif; /* Pixel style font */
  border: 4px solid #000000; /* Pixelated black border */
  box-shadow: 5px 5px 0 #000000, 10px 10px 0 #ffffff; /* Pixel-style shadow */
  z-index: 1000;
  transition: opacity 0.5s ease; /* Smooth fade-in and fade-out transition */
}

nav a {
  text-decoration: none;
  color: white;
  background-color: #000000; /* Dark background for links */
  padding: 10px 15px;
  border: 4px solid white; /* Pixel-style border for each link */
  box-shadow: 3px 3px 0 #ffffff, 6px 6px 0 #000000; /* Pixel shadow */
  font-size: 12px;
  transition: transform 0.2s ease-in-out;
}

nav a:hover {
  background-color: #ffcc00; /* Change background color to gold on hover */
  color: black;
  transform: translate(-3px, -3px); /* "Push" effect on hover */
}

nav a:active {
  transform: translate(2px, 2px); /* Make the link appear pressed */
  box-shadow: 1px 1px 0 #ffffff, 2px 2px 0 #000000;
}
  
router-link {
    padding: 10px;
    background-color: #ff69b4;
    color: white;
    border-radius: 5px;
    text-decoration: none;
    font-family: "Press Start 2P", sans-serif; /* Pixel style font */
  }
</style>
