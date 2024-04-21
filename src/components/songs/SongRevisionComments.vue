<script setup lang="ts">
import { Message as MessageModel, SongRevision, Song, FileMetadata } from '@/api/models';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import apiSongService from '@/api/services/song-service';
import SessionStorageService from '@/services/session-storage-service';
import { FileService } from '@/services/file-service';
import type { AxiosProgressEvent } from 'axios';
import Plyr from 'plyr';
import ConnectionService from '@/api/signalR/connection-service';
import WaveSurfer from 'wavesurfer.js'





const props = defineProps({
    song : {
        type: Song,
        required: true
    },
    songRevsionId: {
        type: String,
        required: true
    }
})

const revision = ref(null as SongRevision | null);
const comments = ref([] as MessageModel[]);
const audioFileService = new FileService('audio');
const player = ref(null as Plyr | null);

const fileLoaded = ref(false);

onMounted(async () => {
    //audioFileService.deleteFile('');
    // Call the API to get the song revision
    revision.value = await apiSongService.getSongRevision(props.songRevsionId);
    comments.value = await apiSongService.getSongRevisionComments(props.song.channelId, props.songRevsionId);
    player.value = new Plyr('#song-player', { 
        controls: [
            'play',
            'mute', 
            'volume', 
            'rewind', 
            'current-time', 
            'duration', 
            'fast-forward', 
            'restart', 
            'download'
        ],
        seekTime: 5,
    });
    player.value.on('timeupdate', (event) => {
        if(wavesurfer.value && player.value) {
            wavesurfer.value.seekTo(player.value.currentTime / player.value.duration);
        }
    });

    wavesurfer.value = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#4F4A85',
        progressColor: '#383351'
    })

    wavesurfer.value.on('click', (event) => {
        if(wavesurfer.value && player.value) {
            player.value.currentTime = wavesurfer.value.getCurrentTime();
        }
    });


    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.dataset['plyr'] === 'download') {
            event.preventDefault();
            
            const audio = document.getElementById('song-player') as HTMLAudioElement;
            const source = audio.getElementsByTagName('source')[0];
            const url = source.src;
            const a = document.createElement('a');
            a.href = url;
            a.download = (revision.value?.revisionName ?? '' + revision.value?.file?.extension ?? '');
            a.click();
        }
    });

    if (await audioFileService.fileExists(fileName.value)){
        loadFile();
        fileLoaded.value = true;
    }
    ConnectionService.init();
    await ConnectionService.start();
    ConnectionService.ConnectToChannel(props.song.channelId);
    ConnectionService.on("Message", receiveMessage);

});

onBeforeUnmount(() => {
    SessionStorageService.removeSessionStorageItem('currentSongRevisionId');
});


function receiveMessage(...args: any[]) {
    const message = args[0] as MessageModel;
    message.createdAt = new Date(message.createdAt + 'Z');

    if (message.channelId != props.song.channelId || props.songRevsionId != message.songRevisionId) {
        return;
    }

    comments.value.push(message);
    formatMessages();
}

function formatMessages() {
    setTimeout(() => {
        comments.value.sort((a, b) => {
            return a.createdAt.getTime() - b.createdAt.getTime();
        });

    }, 100);
}



const fileName = computed(() => {
    return revision.value?.file?.id + '.' + revision.value?.file?.extension;
});


async function loadFile() : Promise<void> {
    const base64 = await audioFileService.getFile(fileName.value);

    var blob = FileService.base64DataUriToBlob(base64);
    setSource(blob);
    
}

function setSource(blob: Blob) {
    var blobUrl = URL.createObjectURL(blob);
    const audio = document.getElementById('song-player') as HTMLAudioElement;
    const source = audio.getElementsByTagName('source')[0];
    source.src = blobUrl;
    audio.pause();
    audio.load();
    audio.oncanplaythrough = () => {
        downloading.value = false;
        fileLoaded.value = true;
    }
    wavesurfer.value?.loadBlob(blob);
}

async function userGetFile(){
    if(!(await audioFileService.fileExists(fileName.value))){
        downloading.value = true;
        const file = await FileService.downloadFile(revision.value!.fileMetadataId, onDownloadProgress);


        const dataUri = FileMetadata.toDataUriString(file);
        await audioFileService.writeFile(fileName.value, dataUri);
        downloading.value = false;
    }
    loadFile();
    fileLoaded.value = true;
}

const downloading = ref(false);
const downloadProgressPercent = ref(null as number | null);

function onDownloadProgress(event: AxiosProgressEvent) : void {
    downloadProgressPercent.value = Math.round((event.loaded / (event.total ?? 1)) * 100);
}


const wavesurfer = ref(null as WaveSurfer | null);


</script>

<style>
.audio-player {
    --plyr-audio-control-color: var(--bs-body-color );
    --plyr-audio-controls-background: var(--bs-body-bg);
}

.plyr__controls {
    display: inline-flex;
}

</style>

<template>
    <div>
        <span v-if="fileLoaded === false && downloading === false" @click="userGetFile">
            File not downloaded
            <a  href="#">Download now</a>
        </span>
        <p v-if="downloading == true" > {{ downloadProgressPercent }}%</p>
        <div class="audio-player" :class="fileLoaded ? '' : 'd-none'">
            <audio id="song-player" style="width:100%" >
                <source src="" type="audio/wav">
            </audio>
        </div>
        <div id="waveform"></div>
        <hr />
        <p>{{ revision?.revisionName }}</p>
    </div>
</template>

