import Vue from 'vue'
import App from './App.vue'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/icon/iconfont.css"
import URL from './utils/globalAPI'
import router from './router'
import store from './store'
import Vuelazyload from 'vue-lazyload'

Vue.config.productionTip = false

Vue.prototype.URL = URL

Vue.use(ElementUI)

Vue.use(Vuelazyload,{
  preLoad:1,
  loading: require('./assets/imgs/loading.png'),
  attempt:2
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
