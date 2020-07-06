import Vue from 'vue';
import App from './App.vue';
import Authenticate from './Authenticate.vue';
import Home from './Home.vue';
import Petitions from './Petitions.vue';
import CreatePetition from './CreatePetition.vue';
import MyPetitions from './MyPetitions.vue';
import Profile from './Profile.vue';

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: Authenticate
  },
  {
    path: "/register",
    name: "register",
    component: Authenticate
  },
  {
    path: "/homepage",
    name: "homepage",
    component: Home
  },
  {
    path: '/petitions/:petitionId',
    name: "one petition",
    component: Petitions
  },
  {
    path: '/petitions',
    name: "petitions",
    component: Petitions
  },
  {
    path: '/create_petition',
    name: "create petition",
    component: CreatePetition
  },
  {
    path: '/my_petitions',
    name: "my petitions",
    component: MyPetitions
  },
  {
    path: '/my_petitions/:petitionId',
    name: "my one petition",
    component: MyPetitions
  },
  {
    path: '/profile',
    name: "profile",
    component: Profile
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});


