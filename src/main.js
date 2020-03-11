import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import FWButton from './components/commons/FWButton.vue'
import FWOptionSelect from './components/commons/FWOptionSelect.vue'
import FWInput from './components/commons/FWInput.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.component('fw-button', FWButton)
Vue.component('fw-select', FWOptionSelect)
Vue.component('fw-input', FWInput)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
