import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Antd:
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { Grid, GridItem } from 'vant';

// Vant:
import { Icon } from 'vant';

// createApp(App).use(router).mount('#app')
const app = createApp(App)
app.use(router)
app.mount('#app')

// Vant组件：
app.use(Icon);
app.use(Grid);
app.use(GridItem);

// Antd:
app.use(Antd).mount('#App')

