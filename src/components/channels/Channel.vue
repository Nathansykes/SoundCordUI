<script setup lang="ts">
import { ref, onMounted, defineProps, onBeforeUnmount, watch } from 'vue';
import SessionStorageService from '@/services/session-storage-service';
import apiChannelService from '@/api/services/channel-service';
import apiMessageService from '@/api/services/message-service';
import type { Channel, Message as MessageModel } from '@/api/models';
import router from '@/router';
import ConnectionService from '@/api/signalR/connection-service';
import ChannelMessage from '../messages/ChannelMessage.vue';

var props = defineProps({
    id: String
})

const currentChannel = ref(null as Channel | null);
const messages = ref([] as MessageModel[]);

var messageContent: string;

onMounted(() => {
    if(props.id == null) {
        router.push({name: 'Home'});
    }
    SessionStorageService.setSessionStorageItem('currentChannelId', props.id!);
    apiChannelService.getChannel(props.id!).then((response) => {
        currentChannel.value = response;
        SessionStorageService.setJsonSessionStorageItem('currentChannel', currentChannel.value);
        apiMessageService.getMessages(props.id!).then((response) => {
            messages.value = response;
            formatMessages();
        });
        ConnectionService.init();
        ConnectionService.start().then(() => {
            ConnectionService.ConnectToChannel(currentChannel.value!.id);
            ConnectionService.on("Message", receiveMessage);
        });
    });
});

onBeforeUnmount(() => {
    ConnectionService.off("Message", receiveMessage);
    ConnectionService.DisconnectFromChannel(currentChannel.value!.id);
    ConnectionService.stop();
});

function receiveMessage(...args: any[]) {
    const message = args[0] as MessageModel;
    message.createdAt = new Date(message.createdAt + 'Z');
    messages.value.push(message);
    formatMessages();
}

function sendMessage(event : Event) {
    event.preventDefault();
    if(!validateForm(event.target as HTMLFormElement)) {
        event.stopPropagation();
        return;
    }
    ConnectionService.SendMessage(currentChannel.value!.id, messageContent);
    messageContent = '';
}

function validateForm(form : HTMLFormElement) {
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }
    return true;
}

watch(messages.value, () => {
    formatMessages();
}); 

function formatMessages() {
    setTimeout(() => {
        messages.value.sort((a, b) => {
            return a.createdAt.getTime() - b.createdAt.getTime();
        });

        //sroll the chat div to the bottm
        var chat = document.querySelector('.chat') as HTMLElement;
        chat.scrollTop = chat.scrollHeight;
    }, 100);
    
}
function messageInputFocusLost() {
    if (messageContent == null || messageContent.trim() === '') {
        var form = document.querySelector('.chat-input form') as HTMLFormElement;
        form.classList.remove('was-validated');
    }
}

</script>

<template>
    <div class="channel ">
        <div class="chat">
            <ChannelMessage v-for="(message, index) in messages" :key="message.id" :message="message" :previous-message="messages[index - 1]" :next-message="messages[index + 1]" />
        </div>
        <div class="chat-input">
            <form @submit.prevent="sendMessage" novalidate>
                <div class="input-group mb-3 has-validation">
                    <input @focusout="messageInputFocusLost" v-model="messageContent" required type="text" class="form-control text-bg-light" placeholder="Type a message" aria-label="Type a message" aria-describedby="send-button">
                    <div class=" invalid-tooltip" style="top: -28px">
                        Please enter a message
                    </div>
                    <button class="btn btn-dark" type="submit" id="send-button">Send</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style>
.channel {
    height: calc( var(--inner-content-height) - 10px);
    max-height: calc( var(--inner-content-height) - 10px );
}
.chat {
    max-height: 83%;
    min-height: 83%;
    overflow-y: scroll;
}

@media (min-width: 992px) {
    .chat {
        max-height: 90%;
        min-height: 90%;
    }
}

.chat {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
}
.chat::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
}
  
.chat-input {
    padding: 10px;
}

</style>