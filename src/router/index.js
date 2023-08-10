import { createRouter, createWebHistory } from 'vue-router'
import DriverLogin from '../views/DriverLogin.vue'
import Manager from '../views/Manager.vue'
import LoggedIn from '../views/LoggedIn.vue'

const routes = [
  {
    path: '/Driver',
    name: 'Driver',
    component: DriverLogin
  },
  {
    path: '/Manager',
    name: 'Manager',
    component: Manager
  },
  {
    path: '/LoggedIn',
    name: 'LoggedIn',
    component: LoggedIn
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    
    
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
