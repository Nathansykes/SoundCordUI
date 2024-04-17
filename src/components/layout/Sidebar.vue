<script setup lang="ts">
import router from '@/router';
import store from '../../store';
import ApplicationUser from '@/application-user';
import { ref, onMounted } from 'vue';
import { Group, Song, Channel } from '@/api/models';
import apiGroupService from '@/api/services/group-service';
import apiChannelService from '@/api/services/channel-service';
import apiSongService from '@/api/services/song-service';

const currentUser = ref(ApplicationUser.getCurrentUser());
const currentGroup = ref(ApplicationUser.getCurrentGroup());
const groups = ref([] as Group[]);
const channels = ref([] as Channel[]);
const songs = ref([] as Song[]);

const creatingChannel = ref(false);
const creatingSong = ref(false);

var channelName : string | null;
var songName : string | null;


function logOut() {
    ApplicationUser.logOut();
    window.location.href = router.resolve({name: 'Login'}).href;
}

onMounted(() => {
    window.addEventListener('userstorage', () => {
        currentUser.value = ApplicationUser.getCurrentUser();
    });

    apiGroupService.getGroups().then((response) => {
        groups.value = response;
        if ((!currentGroup.value) || !groups.value.find(g => g.id === currentGroup.value?.id)) {
            currentGroup.value = groups.value[0];
            if (!currentGroup.value) {
                ApplicationUser.removeCurrentGroup();
                router.push({name: 'Choose Group'});
                return;
            }
            ApplicationUser.setCurrentGroup(currentGroup.value);
        }
    }).then(() => {
        if(!currentGroup.value) return;
        apiChannelService.getChannels(currentGroup.value.id).then((response) => {
            channels.value = response;
            sortChannels();
        });
    }).then(() => {
        if(!currentGroup.value) return;
        apiSongService.getSongs(currentGroup.value.id).then((response) => {
            songs.value = response;
        });
    })
});

function sortChannels() {
    channels.value = channels.value.sort((a, b) => {
        return a.channelName.localeCompare(b.channelName);
    });
}

function createChannelConfirm(event: Event) {
    event.preventDefault();
    apiChannelService.createChannel(currentGroup.value!.id, channelName!).then((response) => {
        channels.value.push(response);
        sortChannels();
        closeCreateChannel();
    });
}
function toggleCreateChannel() {
    creatingChannel.value = !creatingChannel.value;
}
function closeCreateChannel() {
    creatingChannel.value = false;
}

function sortSongs() {
    songs.value = songs.value.sort((a, b) => {
        return a.songName.localeCompare(b.songName);
    });
}

function createSongConfirm(event: Event) {
    event.preventDefault();
    apiSongService.createSong(currentGroup.value!.id, songName!).then((response) => {
        songs.value.push(response);
        sortSongs();
        closeCreateSong();
    });
}
function toggleCreateSong() {
    creatingSong.value = !creatingSong.value;
}
function closeCreateSong() {
    creatingSong.value = false;
    songName= null;
    
}

// function switchGroup(event: Event) {
//     event.preventDefault();
//     ApplicationUser.removeCurrentGroup();
//     window.location.href = router.resolve({name: 'Choose Group'}).href;
// }
</script>

<template>
    <div id="main-sidebar">
        <div :class="(store.isMobile ? 'offcanvas' : '')  +' offcanvas-start offcanvas-body d-flex flex-column flex-shrink-0 p-3 text-white bg-dark sidebar-offcanvas'" tabindex="-1" id="main-sidebar-offcanvas" aria-labelledby="main-sidebar-offcanvasLabel">
            <div class="align-items-center text-white text-decoration-none">
                <span class="fs-4" style="margin-top:4px">
                    <span @click="router.push({name: 'Home'})" class="clickable">{{ currentGroup?.groupName }}</span>
                    <button class="btn btn-sm d-lg-none float-end padding-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#main-sidebar-offcanvas" aria-controls="main-sidebar-offcanvas" role="button" title="Toggle Sidebar">
                        <i class="bi bi-x-lg fs-5 "></i>
                    </button>
                </span>
            </div>
            <hr>
            <ul class="nav nav-pills flex-column mb-auto">
                <i>Text Channels <button class="btn btn-sm btn-secondary float-end" title="Open Create Channel" @click="toggleCreateChannel"><i :class="`bi bi-${creatingChannel ? 'x' : 'plus'}-lg`" ></i></button></i>
                <form v-if="creatingChannel" @submit="createChannelConfirm" style="margin-top:5px">
                    <label class="d-none" title="ChannelName" for="channel-name"></label>
                    <div class="input-group mb-3">
                        <input id="channel-name" type="text" v-model="channelName" 
                               class="form-control" placeholder="Channel Name" 
                               minlength="1" maxlength="200" required
                               aria-label="Channel Name" aria-describedby="create-channel-button">
                        <button class="btn btn-secondary" type="submit" id="create-channel-button" title="Create Channel"><i class="bi bi-check"></i></button>
                    </div>
                </form>
                <li class="nav-item" v-for="channel in channels" :key="channel.id" >
                    <router-link :to="`/channels/${channel.id}/`" class="nav-link text-white clickable channel-sidebar-link" aria-current="page">{{ channel.channelName }}</router-link>  
                </li>
                <hr />
                <i>Songs <button class="btn btn-sm btn-secondary float-end" title="Open Create Song" @click="toggleCreateSong"><i :class="`bi bi-${creatingSong ? 'x' : 'plus'}-lg`" ></i></button></i>
                <form v-if="creatingSong" @submit="createSongConfirm" style="margin-top:5px">
                    <label class=" d-none" title="SongName" for="song-name"></label>
                    <div class="input-group mb-3">
                        <input id="song-name" type="text" v-model="songName" 
                               class="form-control" placeholder="Song Name" 
                               minlength="1" maxlength="200" required
                               aria-label="Channel Name" aria-describedby="create-song-button">
                        <button class="btn btn-secondary" type="submit" id="create-song-button" title="Create Song"><i class="bi bi-check"></i></button>
                    </div>
                </form>
                <li class="nav-item" v-for="song in songs" :key="song.id" >
                    <router-link :to="`/song/${song.id}/`" class="nav-link text-white clickable channel-sidebar-link" aria-current="page">{{ song.songName }}</router-link>  
                </li>
            </ul>
          
            <hr>
          
            <div class="dropdown">
                <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <strong>{{ currentUser?.userName }}</strong>
                </a>
                <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1" style="">
                    <li><router-link to="/choosegroup" class="dropdown-item">Switch Group</router-link></li>
                    <li><router-link to="/settings" class="dropdown-item">Settings</router-link></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a @click="logOut" href="#" class="dropdown-item">Log Out</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>