<script setup lang="ts">
import { Message, SongRevision, Song, FileMetadata } from '@/api/models';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import apiSongService from '@/api/services/song-service';
import apiService from '@/api/services/api-service';
import SessionStorageService from '@/services/session-storage-service';
import { file, dir, write } from 'opfs-tools';
import type { OPFSDirWrap } from '../../../node_modules/opfs-tools/dist/directory.d.ts';
import { FileService } from '@/services/file-service';



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
    var blobUrl = URL.createObjectURL(blob);
        
    const audio = document.getElementById('revisionAudio') as HTMLAudioElement;
    audio.src = blobUrl;
    audio.pause();
    audio.load();
}

async function userGetFile(){
    
    if(!(await audioFileService.fileExists(fileName.value))){
        const file : FileMetadata = await apiService.downloadFile(revision.value!.fileMetadataId);
        const dataUri = FileMetadata.toDataUriString(file);
        await audioFileService.writeFile(fileName.value, dataUri);
    }
    loadFile();
}


</script>

<template>
    <div>
        <p>{{ revision?.revisionName }}</p>
        <p>{{ revision?.id }}</p>
        <p>{{ revision?.fileMetadataId }}</p>
        <button @click="userGetFile">Get File</button>
        <audio controls id="revisionAudio" src=""  />
    </div>
</template>

