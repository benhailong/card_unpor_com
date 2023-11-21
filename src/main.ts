import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// import './style.css'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.css';

import router from '@/routes/index'

//导入store
import store from "@/stores"

import http from '@/http/index'

//导入svg
import svgIcon from '@/icons/index.vue'

const app = createApp(App);
app.use(ArcoVue);
app.use(router)
//使用store
app.use(store)
app.use(http)
app.use(ArcoVueIcon);
app.component('svg-icon', svgIcon);
app.mount('#app');
