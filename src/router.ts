import { createWebHistory, createRouter } from 'vue-router';
import ApplicationUser from './application-user';
import routes, { anonymousRoutes } from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: "current-page",
    linkExactActiveClass: ''
});


router.beforeEach(async (to, _from, next) => {
    if ((!anonymousRoutes.some(r => r.name === to.name)) && !ApplicationUser.isLoggedIn()) {
        next({ name: 'Login' });
    }
    else if (!to.matched.length) {
        next({ name: "Home" });
    }
    else {
        next();
    }
});

export default router;