<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Sidebar from './components/layout/Sidebar.vue';
import Navbar from './components/layout/Navbar.vue';
import store from './store';
import ApplicationUser from './application-user';

onMounted(() => {
    window.addEventListener('resize', onLoadOrResizse);
    document.addEventListener('DOMContentLoaded', onLoadOrResizse); 
    window.addEventListener('load', onLoadOrResizse);
    onLoadOrResizse();
});

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

    <div v-if="ApplicationUser.isLoggedIn()">
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