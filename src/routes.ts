const routes = [
    {
        //Home
        path: "/",
        alias: "/",
        name: "Home",
        component: () => import("./components/home/Home.vue"),
    },
    {
        //account section
        path: "/account",
        children:[
            {
                path: "login",
                component: () => import("./components/account/Login.vue"),
            }
        ]
    }
];

export default routes;