import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//import plugin from './plugins/config'

import './assets/bootstrap/js/bootstrap.bundle.min.js';

import './assets/bootstrap/css/bootstrap.min.css';
import './assets/bootstrap/bootstrap-litera.css';
import './assets/bootstrap/icons/bootstrap-icons.min.css';
import './assets/css/main.css';

//import css for plyr
import 'plyr/dist/plyr.css';


const app = createApp(App)
//app.use(plugin)
app.use(router)
app.mount('#app')