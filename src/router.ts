import { createWebHistory, createRouter } from 'vue-router';
import store from './store';
import { ApplicationUser } from './application-user';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: "current-page",
    linkExactActiveClass: ''
});


router.afterEach((to, from) => {
    let titleMetaEle = document.head.querySelector('title');
    if (titleMetaEle){
        titleMetaEle.text = "Project - " + to.name?.toString();
    }
    else {
        titleMetaEle = document.createElement('title');
        titleMetaEle.text = "Project - " + to.name?.toString();
        document.head.appendChild(titleMetaEle);
    }

});

router.beforeEach(async (to, from, next) => {
    if (to.name !== 'Login' && to.name !== 'Register' && !ApplicationUser.isLoggedIn()){
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