<script setup lang="ts">
import SessionStorageService from '@/services/session-storage-service';

import { onMounted } from 'vue';

onMounted(() => {
    SessionStorageService.clear();
});

</script>



<template>
    <span class="text-center">
        <h1 class="p-2" >Select a channel or song in the sidebar</h1>
        <p class="p2"><i class="bi bi-arrow-left m-auto "></i></p>  
    </span>
</template>
  
<style scoped>
i.bi{
    font-size: 8rem;
    color: var(--bs-secondary);
}
</style>