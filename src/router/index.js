import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: () =>
            import ( /* webpackChunkName: "Home" */ '../views/Home.vue')
    },
    {
        path: '/About',
        name: 'About',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/Tareas',
        name: 'Tareas',
        component: () =>
            import ( /* webpackChunkName: "Tareas" */ '../views/Tareas.vue')
    },
    {
        path: '/Ncalendario',
        name: 'Ncalendario',
        component: () =>
            import ( /* webpackChunkName: "Ncalendario" */ '../views/Ncalendario.vue')
    },
    {
        path: '/Store',
        name: 'Store',
        component: () =>
            import ( /* webpackChunkName: "Store" */ '../views/Store.vue')
    },
    {
        path: '/Library',
        name: 'Library',
        component: () =>
            import ( /* webpackChunkName: "Cobol" */ '../views/Library.vue')
    }

]

const router = new VueRouter({
    routes
})

export default router