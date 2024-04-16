<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Sidebar from './components/layout/Sidebar.vue';
import Navbar from './components/layout/Navbar.vue';
import store from './store';
import ApplicationUser from './application-user';
import ApiAccountService from './api/services/account-service';
import router from './router';


const currentUser = ref(ApplicationUser.getCurrentUser());

onMounted(() => {
    window.addEventListener('resize', onLoadOrResizse);
    document.addEventListener('DOMContentLoaded', onLoadOrResizse); 
    window.addEventListener('load', onLoadOrResizse);
    onLoadOrResizse();
    checkLogin();

    window.addEventListener('userstorage', () => {
        currentUser.value = ApplicationUser.getCurrentUser();
    });
    setInterval(checkLogin, 1000 * 60); // 1 minute
});

function checkLogin() {
    if(window.location.href.includes("account/login") || window.location.href.includes("account/register")){
        return;
    }

    ApiAccountService.GetUserDetails().then(() => {
        currentUser.value = ApplicationUser.getCurrentUser();
    }).catch(() => {
        ApiAccountService.Refresh().then(() => {
            currentUser.value = ApplicationUser.getCurrentUser();
        }).catch(() => {
            logOut()
        });
    });
}

function logOut() {
    currentUser.value = null;
    ApplicationUser.logOut();
    window.location.href = router.resolve({name: 'Login'}).href;
}


function onLoadOrResizse() {
    store.isMobile = window.innerWidth < 992;

    document.body.style.setProperty('--scrollbar-width', `${window.innerWidth - document.documentElement.clientWidth}px`);
    document.body.style.setProperty('--main-content-width', "calc(100vw - (280px + var(--scrollbar-width)))");
    
    const navbarHeight = document.getElementById("main-navbar")?.offsetHeight;
    if (navbarHeight){
        document.body.style.setProperty('--navbar-height',  `${navbarHeight}px`);
        document.body.style.setProperty('--inner-content-height', `calc(100vh - ${navbarHeight}px)`);
    }
}

	

</script>

<template>

    <div v-if="currentUser != null">
        <Sidebar />
        <div id="main-content" style="">
            <Navbar />
            <div id="main-inner-content">
                <router-view />
            </div>
        </div>
    </div>
    <div v-else>
        <router-view />
    </div>

</template>

<style scoped>


</style>