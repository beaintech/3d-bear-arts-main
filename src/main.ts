import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Only if you are using a router

const app = createApp(App);
app.use(router);  // Only if you are using a router
app.mount('#app');
