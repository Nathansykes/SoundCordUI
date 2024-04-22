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
        <nav class="navbar navbar-expand-lg bg-body-tertiary" style="min-height:55px;">
            <div class="container-fluid">
                <div class="d-lg-none">
                    <button class="btn btn-sm " style="padding-top:0" type="button" data-bs-toggle="offcanvas" data-bs-target="#main-sidebar-offcanvas" aria-controls="main-sidebar-offcanvas" role="button" title="Toggle Sidebar">
                        <i class="bi bi-list fs-5"></i>
                    </button>
                </div>
                <span class="navbar-brand" >{{ currentChannel?.channelName}}</span>
            </div>
        </nav>
    </div>
</template>
