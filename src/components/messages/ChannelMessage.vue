<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Message } from '@/api/models';
import ApplicationUser from '@/application-user';

const props = defineProps({
    message: {
        type: Message,
        required: true
    },
    previousMessage: {
        type: Message,
        required: false
    },
    nextMessage: {
        type: Message,
        required: false
    }

})

const currentUser = ref(ApplicationUser.getCurrentUser());
const messageTimeString = ref('');
const isCurrentUser = ref(false);
const id = getRandomInt(0, 1000000).toString();

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

onMounted(() => {
    messageTimeString.value = props.message.createdAt.toLocaleDateString() + ' ' + props.message.createdAt.toLocaleTimeString();
    isCurrentUser.value = currentUser.value?.userName.toLowerCase() === props.message.user.toLowerCase();
})

function showTime() {
    const time = document.getElementById(id + '-time');
    const content = document.getElementById(id + '-content');
    if(time && content) {
        if(time.style.display === 'none') {
            time.style.display = 'block';
        } else {
            time.style.display = 'none';
            content.style.display = 'block';
        }
    }

}


</script>

<template>
    <i style="display: none;" class="small msg-time"  :id="id + '-time'" :class="(isCurrentUser ? 'sent' : 'rcvd')" >{{ messageTimeString }}</i>
    <i v-if="(isCurrentUser === false) && previousMessage?.user != message.user">{{ message.user }}</i>
    <div @click="showTime" :id="id + '-content'" :class="'msg ' + (isCurrentUser ? 'sent' : 'rcvd')">
        {{ props.message.content }}
    </div>
</template>



<style>

</style>