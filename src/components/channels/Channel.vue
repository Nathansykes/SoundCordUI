<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import SessionStorageService from '@/services/session-storage-service';
import apiChannelService from '@/api/services/channel-service';
import apiMessageService from '@/api/services/message-service';
import type { Channel, Message } from '@/api/models';
import router from '@/router';

var props = defineProps({
    id: String
})

const currentChannel = ref(null as Channel | null);
const messages = ref([] as Message[]);

onMounted(() => {
    if(props.id == null) {
        router.push({name: 'Home'});
    }
    SessionStorageService.setSessionStorageItem('currentChannelId', props.id!);
    apiChannelService.getChannel(props.id!).then((response) => {
        currentChannel.value = response;
        SessionStorageService.setJsonSessionStorageItem('currentChannel', currentChannel.value);
    });
    apiMessageService.getMessages(props.id!).then((response) => {
        messages.value = response;
        orderMessagesByDate(messages.value);
    });
});

function orderMessagesByDate(messages: Message[]) {
    return messages.sort((a, b) => {
        return new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime();
    });
}

</script>

<template>
    <div>
        <p v-for="message in messages" :key="message.id">{{ message.content }}</p>
    </div>
</template>

<style scoped>

</style>