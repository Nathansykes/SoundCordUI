<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Channel from '@/components/channels/Channel.vue'
import { Song, SongRevision } from '@/api/models';
import apiSongService from '@/api/services/song-service';
import SessionStorageService from '@/services/session-storage-service';
import type { AxiosProgressEvent } from 'axios';
import type { onProgress } from  '@/api/services/api-service';
import SongRevisionComments from './SongRevisionComments.vue';

// Define the props for the component
var props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const currentSong = ref(null as Song | null);
const currentSongRevisionId = ref(null as string | null);

const files = ref([] as SongRevision[]);

var newRevisionName: string;

onMounted(() => {
    // Call the API to get the channel for the song
    apiSongService.getSong(props.id).then((response) => {
        // Set the channel for the song
        currentSong.value = response;
        SessionStorageService.setJsonSessionStorageItem('currentSong', currentSong.value);
    });
    apiSongService.getSongRevisions(props.id).then((response) => {
        files.value = response;
        sortFiles();
    });

    window.addEventListener("sessionstorage", function(e) {
        currentSongRevisionId.value = SessionStorageService.getSessionStorageItem('currentSongRevisionId');
    });
});

function miliisecondsToMinutesAndSeconds(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
}

function getDateString(date: Date){
    return date.toLocaleTimeString().slice(0, -3) + ' - ' + date.toLocaleDateString();
}

const uploading = ref(false);

async function fileUploadSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if(!validateForm(form)){
        event.stopPropagation();
        return;
    }
    uploading.value = true;
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files?.item(0);
    //get the file as base64 string
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target!.result!;
            var audio = document.createElement('audio');
            audio.src = data.toString();
            audio.addEventListener('loadedmetadata', async function() {

                try {

                    const durationMs = Math.floor(audio.duration * 1000);
                    const base64 = data.toString().replace(/^data:(.*,)?/, '');
                    const contentType = data.toString().match(/(.*);base64/)?.[1].replace('data:', '');
                    const result = await apiSongService.createSongRevision(props.id, newRevisionName, file.name, base64, contentType, durationMs, onUploadProgress);
                    uploadProgressPercent.value = null;
                    files.value.push(result);
                    sortFiles();
                } catch (error) {
                    console.error(error);
                }
                resetForm(form);
                uploading.value = false;


            }, false);
        }
        reader.readAsDataURL(file);
    }
}

const uploadProgressPercent = ref(null as number | null);

function onUploadProgress(event: AxiosProgressEvent) : void {
    uploadProgressPercent.value = Math.round((event.loaded / (event.total ?? 1)) * 100);
}

function onDownloadProgress(event: AxiosProgressEvent) : void {
    console.log('download progress: ' + event.loaded + ' of ' + event.total);
}

function validateForm(form: HTMLFormElement) : boolean {
    let htmlValid = form.checkValidity();
    form.classList.add('was-validated');
    return htmlValid;
}

function resetForm(form: HTMLFormElement) {
    form.classList.remove('was-validated');
    form.reset();
}

function sortFiles() {
    files.value.sort((a, b) => {
        return b.createdUtc.getTime() - a.createdUtc.getTime();
    });
}

function download(fileMetadataId: string) {
    console.log("download file with id: " + fileMetadataId);
}



function viewComments(songRevisionId: string) {
    currentSongRevisionId.value = songRevisionId;
    console.log('view comments for song revision id: ' + currentSongRevisionId.value);
    SessionStorageService.setSessionStorageItem('currentSongRevisionId', currentSongRevisionId.value);
    var linkEle = document.querySelector('a[href="#comments-tab"]') as HTMLElement;
    linkEle.click();
}

function bytesToSizeString(bytes: number) {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round(bytes / Math.pow(1024, i)) + sizes[i];
}

</script>

<template>
    <ul class="nav nav-tabs" role="tablist" style="margin-bottom: 10px;">
        <li class="nav-item" role="presentation">
            <a class="nav-link active" data-bs-toggle="tab" href="#chat-tab" aria-selected="true" role="tab">Song Chat</a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link" data-bs-toggle="tab" href="#file-tab" aria-selected="false" tabindex="-1" role="tab">Files</a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link" data-bs-toggle="tab" href="#comments-tab" aria-selected="false" tabindex="-1" role="tab">Comments</a>
        </li>
    </ul>
    <div id="myTabContent" class="tab-content" >
        <div class="tab-pane fade show active" id="chat-tab" role="tabpanel">
            <Channel v-if="currentSong != null" :id="currentSong.channelId" />
        </div>
        <div class="tab-pane fade" id="file-tab" role="tabpanel">
            <div class="clickable" data-bs-toggle="collapse" data-bs-target="#fileUploadFormContainer">Upload new file <i class="bi  bi-caret-down"></i></div>
            <div class="row collapse" id="fileUploadFormContainer">
                <div class="col-md-6" >
                    <form @submit="fileUploadSubmit" novalidate id="songRevisionUploadFor">
                        <div class="form-group">
                            <label for="revisionName" class="form-label mt-4" title="file/song version name">File/song version name</label>
                            <input required type="text" class="form-control text-bg-light" id="revisionName" placeholder="Enter a name" v-model="newRevisionName">
                            <div class="invalid-feedback">
                                Please enter a name for the file/song version
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="formFile" class="form-label mt-4">Select an audio file</label>
                            <input required accept=".mp3,.wav" class="form-control text-bg-light" type="file" id="formFile">
                            <div class=" invalid-feedback">
                                Please select a file of type '.mp3' or '.wav'
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary mt-4">
                            {{ uploading ? "Uploading" : "Upload" }}
                            <span v-if="uploading === true">
                                <span v-if="uploadProgressPercent">{{ uploadProgressPercent }}% </span>
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </span>
                        </button>
                    </form>
                </div>
            </div>
            <hr />
            <div id="filesContainer" >
                <div v-for="songRev in files" :key="songRev.id"  class="card text-white bg-dark mb-3" >
                    <div class="card-header">
                        {{ songRev.revisionName }} <br />
                        <a @click="download(songRev.fileMetadataId)" href="#">Download</a> | 
                        <a @click="viewComments(songRev.id)" href="#">View Comments</a>
                    </div>
                    <div class="card-body">
                        <p class="card-title">Uploaded: {{ getDateString(songRev.createdUtc) }}</p>
                        <p class="card-text">
                            <ul>
                                <li>
                                    Duration: {{ miliisecondsToMinutesAndSeconds(songRev.lengthMilliseconds) }}
                                </li>
                                <li>
                                    Filename: {{ songRev.file?.fileName +'.' + songRev.file?.extension }}
                                </li>
                                <li>
                                    Type: {{ songRev.file?.extension }}
                                </li>
                                <li>
                                    Size: {{ bytesToSizeString(songRev.file?.contentLength || 0)}}
                                </li>
                            </ul>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="comments-tab" role="tabpanel">
            <SongRevisionComments v-if="currentSongRevisionId !== null && currentSong !== null"  :song="currentSong" :songRevsionId="currentSongRevisionId" />
        </div>
    </div>
</template>

<style scoped>

#filesContainer {
    overflow-y:scroll; 
    max-height: 75vh; 
    padding-right: 10px;
}

@media (min-width: 992px) {
    #filesContainer {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 10px;
    }
    .card {
        width: 480px;
    }
}
</style>