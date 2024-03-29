import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Antd:
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { Overlay } from 'vant';

// Vant:
import { Icon } from 'vant';
import { Grid, GridItem } from 'vant';
import { Tab, Tabs } from 'vant';


// createApp(App).use(router).mount('#app')
const app = createApp(App)

app.directive('title', {
	mounted(el){
		document.title = el.dataset.title
	}
})  // 页面title

app.use(router)
app.mount('#app')

// Antd:
app.use(Antd).mount('#App')

// Vant组件：
app.use(Icon);
app.use(Grid);
app.use(GridItem);
app.use(Overlay);
app.use(Tab);
app.use(Tabs);
