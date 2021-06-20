import Vue from 'vue'
import App from './App.vue'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/icon/iconfont.css"
import URL from './utils/globalAPI'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.URL = URL

Vue.use(ElementUI)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
