<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Message } from "@/api/models";
import ApplicationUser from "@/application-user";

const props = defineProps({
    message: {
        type: Message,
        required: true,
    },
    previousMessage: {
        type: Message,
        required: false,
    },
    nextMessage: {
        type: Message,
        required: false,
    },
});

const currentUser = ref(ApplicationUser.getCurrentUser());
const messageTimeString = ref("");
const isCurrentUser = ref(false);
const id = getRandomInt(0, 1000000).toString();
const isFirstInGroup = ref(false);
const isLastInGroup = ref(false);

const className = ref("");

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

onMounted(() => {
    const messageIsToday =
        new Date().toLocaleDateString() === props.message.createdAt.toLocaleDateString();
    
    const dateString = !messageIsToday
        ? props.message.createdAt.toLocaleDateString()
        : "" 
    const timeString = props.message.createdAt.toLocaleTimeString().slice(0, -3);
    
    messageTimeString.value = dateString + " " + timeString;

    const minutesSinceLastMessage = props.previousMessage
        ? Math.abs(
            (props.previousMessage.createdAt.getTime() - props.message.createdAt.getTime()) /
                60000
        )
        : 0;
    const minutesUntilNextMessage = props.nextMessage
        ? Math.abs(
            (props.nextMessage.createdAt.getTime() - props.message.createdAt.getTime()) /
                60000
        )
        : 0;

    isCurrentUser.value =
        currentUser.value?.userName.toLowerCase() === props.message.user.toLowerCase();

    isFirstInGroup.value =
        props.previousMessage?.user != props.message.user || minutesSinceLastMessage > 15;

    isLastInGroup.value =
        props.nextMessage == null ||
        props.nextMessage?.user != props.message.user ||
        minutesUntilNextMessage > 15;
        
    if (isLastInGroup.value) {
        className.value = "msg-last";
    }
    if (isFirstInGroup.value) {
        className.value = "msg-first";
    }
});

computed(() => {
    return {
        messageTimeString,
        isCurrentUser,
        isFirstInGroup,
        isLastInGroup,
    };
});

function showTime() {
    const time = document.getElementById(id + "-time");
    const content = document.getElementById(id + "-content");
    if (time && content) {
        if (time.style.display === "none") {
            time.style.display = "block";
        } else {
            time.style.display = "none";
            content.style.display = "block";
        }
    }
}
</script>

<template>
    <div :id="id + '-content'"
         @click="showTime"
         :class="'msg ' + (isCurrentUser ? 'sent' : 'rcvd')"
    >
        <i :id="id + '-time'"
           :style="isFirstInGroup ? '' : 'display: none;'"
           class="small msg-time"
           :class="isCurrentUser ? 'sent' : 'rcvd'"
        >
            {{ messageTimeString }} <br />
        </i>
        <i 
            v-if="isFirstInGroup && !isCurrentUser"
        >
            {{ message.user }} <br />
        </i>
        <div 
            class="msg-content" 
            :class="className"
        >
            {{ props.message.content }}
        </div>
    </div>
</template>