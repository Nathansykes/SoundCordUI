
const anonymousRoutes = [
    {
        path: "/account/login",
        name: "Login",
    },
    {
        path: "/account/register",
        name: "Register",
    },
    {
        path: "/account/forgotpassword",
        name: "Forgot Password",
    
    },
    {
        path: "/account/resetpassword",
        name: "Reset Password",
    }
];

const routes = [
    {
        //Home
        path: "/",
        alias: "/",
        name: "Home",
        component: () => import("./components/home/Home.vue"),
    },
    {
        //Choose Group
        path: "/choosegroup",
        name: "Choose Group",
        component: () => import("./components/groups/ChooseGroup.vue"),
    },
    {
        //Channel
        path: "/channels/:id",
        name: "Channel",
        props: true,
        component: () => import("./components/channels/Channel.vue"),
    },
    {
        //Song
        path: "/songs/:id",
        name: "Song",
        props: true,
        component: () => import("./components/songs/Song.vue"),
    },
    {
        //account section
        path: "/account",
        children:[
            {
                path: "login",
                name: "Login",
                props: (route: { query: { state: boolean; }; }) => ({ query: route.query.state }),
                component: () => import("./components/account/Login.vue"),
            },
            {
                path: "register",
                name: "Register",
                component: () => import("./components/account/Register.vue"),
            },
            {
                path: "forgotpassword",
                name: "Forgot Password",
                component: () => import("./components/account/ForgotPassword.vue"),
            },
            {
                path: "resetpassword",
                name: "Reset Password",
                props: (route: { query: { token: boolean; username:string;  }; }) => ({ query: route.query.token, username: route.query.username}),
                component: () => import("./components/account/ResetPassword.vue"),
            }
        ]
    }
];

export { anonymousRoutes };
export default routes;