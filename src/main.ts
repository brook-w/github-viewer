import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from './router/index'


// @ts-ignore
import {mavonEditor} from "mavon-editor";
import "mavon-editor/dist/css/index.css";


const app = createApp(App as any)
app.use(router)
app.component("mavon-editor", mavonEditor);
app.use(createPinia())
app.mount('#app')


