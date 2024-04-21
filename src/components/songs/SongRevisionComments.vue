<script setup lang="ts">
import { Message, SongRevision, Song } from '@/api/models';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import apiSongService from '@/api/services/song-service';
import SessionStorageService from '@/services/session-storage-service';


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

onMounted(async () => {
    // Call the API to get the song revision
    revision.value = await apiSongService.getSongRevision(props.song.id, props.songRevsionId);
    comments.value = await apiSongService.getSongRevisionComments(props.song.channelId, props.songRevsionId);
});

onBeforeUnmount(() => {
    SessionStorageService.removeSessionStorageItem('currentSongRevisionId');
});

async function getFile(){
    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle(revision.value!.fileMetadataId, { create: false });
    
}

</script>

<template>
    <div>

    </div>
</template>

