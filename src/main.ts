import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import apiService from './api/services/api-service';


// import boostrap
import './assets/bootstrap/js/bootstrap.bundle.min.js';
import './assets/bootstrap/css/bootstrap.min.css';
import './assets/bootstrap/bootstrap-litera.css';
import './assets/bootstrap/icons/bootstrap-icons.min.css';

// import local css
import './assets/css/main.css';

//import css for plyr
import 'plyr/dist/plyr.css';

apiService.post('wakeup');

const app = createApp(App)
app.use(router)
app.mount('#app')