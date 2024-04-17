import { createWebHistory, createRouter } from 'vue-router';
import ApplicationUser from './application-user';
import routes, { anonymousRoutes } from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: "current-page",
    linkExactActiveClass: ''
});

router.afterEach(async (to, _from) => {
    if(to.name === 'Choose Group'){
        window.dispatchEvent(new CustomEvent('choosegroup'));
    }
})

router.beforeEach(async (to, _from, next) => {
    if ((!anonymousRoutes.some(r => r.name === to.name)) && !ApplicationUser.isLoggedIn()) {
        next({ name: 'Login' });
        return;
    }
    else if (anonymousRoutes.some(r => r.name === to.name) && ApplicationUser.isLoggedIn()) {
        next({ name: 'Home' });
        return;
    }
    else if (!to.matched.length) {
        next({ name: "Home" });
        return;
    }

    next();
});

export default router;