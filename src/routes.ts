const routes = [
    {
        //Home
        path: "/",
        alias: "/",
        name: "Home",
        component: () => import("./pages/home/components/Home.vue"),
    },
    {
        //account section
        path: "/account",
        children:[
            {
                path: "login",
                component: () => import("./pages/account/components/Login.vue"),
            }
        ]
    }
];

export default routes;