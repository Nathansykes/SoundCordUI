<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Sidebar from './components/layout/Sidebar.vue';
import Navbar from './components/layout/Navbar.vue';
import store from './store';
import ApplicationUser from './application-user';
import ApiAccountService from './api/services/account-service';
import router from './router';
import Modal from 'bootstrap/js/dist/modal';


const currentUser = ref(ApplicationUser.getCurrentUser());
const currentGroup = ref(ApplicationUser.getCurrentGroup());
const isChoosingGroup = ref(false);
const modalEnabled = ref(false);

onMounted(() => {
    window.addEventListener('resize', onLoadOrResizse);
    document.addEventListener('DOMContentLoaded', onLoadOrResizse); 
    window.addEventListener('load', onLoadOrResizse);
    onLoadOrResizse();
    checkLogin();

    if (currentGroup.value == null){
        if (router.currentRoute.value.name !== 'Choose Group') {
            router.push({name: 'Choose Group'});
        }
    }

    window.addEventListener('userstorage', () => {
        currentUser.value = ApplicationUser.getCurrentUser();
        currentGroup.value = ApplicationUser.getCurrentGroup();
    });
    setInterval(checkLogin, 1000 * 60); // 1 minute

    window.addEventListener('choosegroup', () => {
        isChoosingGroup.value = router.currentRoute.value.name === 'Choose Group'
        modalEnabled.value = true;
        var md = document.getElementById('exampleModal');
        const m = Modal.getOrCreateInstance(md!)
        m?.show();
        
    });
});

function checkLogin() {
    if(window.location.href.includes("/account/")) {
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

function groupClose(){
    isChoosingGroup.value = false;
    modalEnabled.value = false;
    var md = document.getElementById('exampleModal');
    const m = Modal.getOrCreateInstance(md!)
    m?.hide();
    router.back();
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
        <div v-if="currentGroup != null">
            <div v-if="isChoosingGroup">
                <Sidebar />
                <div id="main-content" style="">
                    <Navbar />
                    <div id="main-inner-content">
                    </div>
                </div>
            </div>
            <div v-else>
                <Sidebar />
                <div id="main-content" style="">
                    <Navbar />
                    <div id="main-inner-content">
                        <router-view :key="$route.fullPath" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <router-view :key="$route.fullPath"  />
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Choose a group</h5>
                    <button v-if="currentGroup != null" @click="groupClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="modalEnabled">
                        <router-view  :key="$route.fullPath" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    

</template>

