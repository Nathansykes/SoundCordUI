<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import SessionStorageService from '@/services/session-storage-service';
import apiChannelService from '@/api/services/api-channel-service';

import type { Channel } from '@/api/models';
import router from '@/router';

var props = defineProps({
    id: String
})

const currentChannel = ref(null as Channel | null);

onMounted(() => {
    if(props.id == null) {
        router.push({name: 'Home'});
    }
    SessionStorageService.setSessionStorageItem('currentChannelId', props.id!);
    apiChannelService.getChannel(props.id!).then((response) => {
        currentChannel.value = response;
        SessionStorageService.setJsonSessionStorageItem('currentChannel', currentChannel.value);
    });
});

</script>

<template>
    <div>
        <h1>Channel {{ currentChannel?.channelName }} </h1>
    </div>  
</template>

<style scoped>

</style>