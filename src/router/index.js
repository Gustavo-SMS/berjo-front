import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/login/RegisterView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/resetPassword',
      name: 'resetPassword',
      component: () => import('../views/login/ResetPasswordView.vue')
    },
    {
      path: '/customerProfile',
      name: 'customerProfile',
      component: () => import('../views/customers/CustomerProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/createCustomer',
      name: 'createCustomer',
      component: () => import('../views/customers/CreateCustomersView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/customers/CustomersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/createOrder',
      name: 'createOrder',
      component: () => import('../views/orders/CreateOrdersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/orders/OrdersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/blindTypes',
      name: 'blindTypes',
      component: () => import('../views/blindTypes/BlindTypeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/createBlindTypes',
      name: 'createBlindTypes',
      component: () => import('../views/blindTypes/CreateBlindTypeView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.accessToken) {
    await authStore.loadFromStorage()
  }

  const isAuthenticated = !!authStore.accessToken
  const isAdmin = authStore.userRole === 'ADMIN'

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/')
  }

  next()
})

export default router
