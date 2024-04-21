<script setup lang="ts">
import { Message, SongRevision, Song, FileMetadata } from '@/api/models';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import apiSongService from '@/api/services/song-service';
import SessionStorageService from '@/services/session-storage-service';
import { FileService } from '@/services/file-service';
import type { AxiosProgressEvent } from 'axios';



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
const comments = ref([] as Message[]);
const audioFileService = new FileService('audio');

onMounted(async () => {
    // Call the API to get the song revision
    revision.value = await apiSongService.getSongRevision(props.songRevsionId);
    comments.value = await apiSongService.getSongRevisionComments(props.song.channelId, props.songRevsionId);
});

onBeforeUnmount(() => {
    SessionStorageService.removeSessionStorageItem('currentSongRevisionId');
});


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
        
    const audio = document.getElementById('revisionAudio') as HTMLAudioElement;
    audio.src = blobUrl;
    audio.pause();
    audio.load();
    audio.oncanplaythrough = () => {
        downloading.value = false;
    }
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

}

const downloading = ref(false);
const downloadProgressPercent = ref(null as number | null);

function onDownloadProgress(event: AxiosProgressEvent) : void {
    downloadProgressPercent.value = Math.round((event.loaded / (event.total ?? 1)) * 100);
}

</script>

<template>
    <div>
        <audio controls id="revisionAudio" src="" style="width:100%" />
        <button @click="userGetFile" type="button" class="btn btn-secondary">Load</button>
        <p v-if="downloading == true" > {{ downloadProgressPercent }}%</p>
        <p>{{ revision?.revisionName }}</p>
    </div>
</template>

