import Vue, { VNode } from 'vue';
import Dev from './serve.vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify)
Vue.config.productionTip = false;

new Vue({
  render: (h): VNode => h(Dev),
  vuetify: new Vuetify({}),
}).$mount('#app');
