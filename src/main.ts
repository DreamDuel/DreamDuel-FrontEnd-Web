import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(vue3GoogleLogin, {
  clientId: '1014759548576-i6n3bgji9aq8ejmrr6666a698p9alsfa.apps.googleusercontent.com',
  scope: 'email profile',
  prompt: 'select_account'
});

app.mount('#app');
