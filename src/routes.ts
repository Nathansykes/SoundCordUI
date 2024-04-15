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
                name: "Login",
                component: () => import("./components/account/Login.vue"),
            },
            {
                path: "register",
                name: "Register",
                component: () => import("./components/account/Register.vue"),
            }
        ]
    }
];

export default routes;