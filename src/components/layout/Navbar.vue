<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SessionStorageService from '@/services/session-storage-service';
import type { Channel } from '@/api/models';

const currentChannel = ref(SessionStorageService.getJsonSessionStorageItem<Channel>('currentChannel'));

onMounted(() => {
    window.addEventListener('sessionstorage', () => {
        currentChannel.value = SessionStorageService.getJsonSessionStorageItem<Channel>('currentChannel');
    });
});


</script>

<template>
    <div id="main-navbar" style="">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <div class="d-lg-none">
                    <button class="btn btn-sm " style="padding-top:0" type="button" data-bs-toggle="offcanvas" data-bs-target="#main-sidebar-offcanvas" aria-controls="main-sidebar-offcanvas" role="button" title="Toggle Sidebar">
                        <i class="bi bi-list fs-5"></i>
                    </button>
                </div>
                <span class="navbar-brand" >{{ currentChannel?.channelName }}</span>
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                </ul>
                <div class="d-flex" role="search">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Navbar Link</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>
