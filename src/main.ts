import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import vue3GoogleLogin from 'vue3-google-login';

// Inicializar session_id para guest checkout
let sessionId = localStorage.getItem('guest_session_id');
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem('guest_session_id', sessionId);
  console.log('🆔 Nueva sesión guest creada:', sessionId);
} else {
  console.log('🆔 Sesión guest existente:', sessionId);
}

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(vue3GoogleLogin, {
  clientId: '1014759548576-i6n3bgji9aq8ejmrr6666a698p9alsfa.apps.googleusercontent.com'
});

app.mount('#app');
