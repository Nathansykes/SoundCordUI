<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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

    if(!ApplicationUser.isLoggedIn()){
        return;
    }

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

    setInterval(() => {
        if (isExampleGroup.value) {
            obfuscate();
        }
    }, 500)
});

const isExampleGroup = computed(() => {
    return currentGroup.value?.id?.toUpperCase() == 'F8E94F19-6301-EF11-AAF0-6045BD13BBCF';
})

function obfuscate(){
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach((input) => {
        if(input.classList.contains('no-obfuscate')) {
            return;
        }
        input.disabled = true;
    });

    const allSubmitButtons = document.querySelectorAll('button[type="submit"]');
    allSubmitButtons.forEach((button) => {
        if(button.classList.contains('no-obfuscate')) {
            return;
        }
        (button as HTMLButtonElement).disabled = true;
    });
}

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

    if(store.isMobile) {
        document.body.style.setProperty('--main-content-width', "100vw");
    } else {
        document.body.style.setProperty('--main-content-width', "calc(100vw - (280px + var(--scrollbar-width)))");
    }
    
    const navbarHeight = document.getElementById("main-navbar")?.offsetHeight;
    if (navbarHeight){
        document.body.style.setProperty('--navbar-height',  `${navbarHeight}px`);
        window.innerHeight;
        document.body.style.setProperty('--window-inner-height', `${window.innerHeight}px`);
        document.body.style.setProperty('--inner-content-height', `calc(${window.innerHeight}px - ${navbarHeight}px)`);
    }
}

	

</script>

<template>

    <div class="if current user and current group" v-if="currentUser != null && currentGroup != null">
        <div class="is choosing group" v-if="isChoosingGroup === true">
            <Sidebar />
            <div id="main-content" style="">
                <Navbar />
                <div id="main-inner-content">
                </div>
            </div>
        </div>
        <div class="is not choosing group" v-if="isChoosingGroup === false">
            <Sidebar />
            <div id="main-content" style="">
                <Navbar />
                <div id="main-inner-content">
                    <router-view :key="$route.fullPath" />
                </div>
            </div>
        </div>
    </div>
    <div class="thElse" v-else-if=" currentUser == null || currentGroup">
        <router-view :key="$route.fullPath"  />
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
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

