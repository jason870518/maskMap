import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

import App from './App.vue';
import router from './router';
import store from './store';

import fontawesome from '@fortawesome/fontawesome';
import {
  faSearch,
  faHome,
  faAngleDoubleRight,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';

fontawesome.library.add(faSearch);
fontawesome.library.add(faHome);
fontawesome.library.add(faAngleDoubleRight);
fontawesome.library.add(faPhoneAlt);

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.component('Loading', Loading)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');