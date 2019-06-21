import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'

Vue.use(VueResource)
import { routes } from './routes';
import { store } from './store';

Vue.use(VueRouter);
Vue.config.productionTip = false;

Vue.filter('currency', function(value) {
  let val = (value/1).toFixed(2).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
});

const router = new VueRouter({
  routes,
  mode: 'history'
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
