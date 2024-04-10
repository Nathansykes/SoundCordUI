import { createWebHistory, createRouter } from 'vue-router';

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
    if (!to.matched.length) {
        next({ name: "Home" });
    }
    next();
});

export default router;