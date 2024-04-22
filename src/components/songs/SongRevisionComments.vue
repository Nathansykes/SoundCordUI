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

class Thread {
    constructor(position_x: number, position_y: number, timeSeconds: number, commentsCount: number) {
        this.position_x = position_x;
        this.position_y = position_y;
        this.commentsCount = commentsCount;
        this.timeSeconds = timeSeconds;
    }

    position_x: number;
    position_y: number;
    timeSeconds: number;
    commentsCount: number;
}

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

const fileLoaded = ref(null as boolean | null);

const threads = ref([] as Thread[]);

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
        ],
        seekTime: 5,
    });
    player.value.on('timeupdate', () => {
        try {
            if(wavesurfer.value && player.value) {
                let val = player.value.currentTime / player.value.duration;
                if (!isDragging.value){
                    wavesurfer.value.seekTo(val);
                }
            }
        } catch {
            // do nothing
        }
    });

    const isDragging = ref(false);

    wavesurfer.value = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#4582ec',
        progressColor: '#133a7d',
        dragToSeek: {
            debounceTime: 50
        },
    })

    wavesurfer.value.on('dragstart', () => {
        isDragging.value = true;
    });

    wavesurfer.value.on('dragend', () => {
        isDragging.value = false;
        try {
            player.value!.currentTime = wavesurfer.value!.getCurrentTime();
        } catch {
            // do nothing
        }
    });

    wavesurfer.value.on('click', () => {
        try {
            if(wavesurfer.value && player.value) {
                let val = wavesurfer.value.getCurrentTime();
                console.log(val);
                player.value.currentTime = wavesurfer.value.getCurrentTime();
            }
        } catch {
            // do nothing
        }
    });


    document.addEventListener('click', (event) => {
        handleClickForPopover(event);
    });

    document.getElementById('startCommentPopover')?.addEventListener('keydown', (event) => {
        const isDigit = /\d/.test(event.key);
        const isBackspace = event.key === 'Backspace';
        const isLeftOrRightArrow = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
        if(!(isDigit || isBackspace || isLeftOrRightArrow)){
            event.preventDefault();
        }
    });

    if (await audioFileService.fileExists(fileName.value)){
        loadFile();
        fileLoaded.value = true;
    } else {
        fileLoaded.value = false;
    }
    
    ConnectionService.init();
    await ConnectionService.start();
    ConnectionService.ConnectToChannel(props.song.channelId);
    ConnectionService.on("Message", receiveMessage);
    loadThreads();
});


function loadThreads(){
    threads.value = [];
    const filteredComments = comments.value.filter(c => c.songTimestampMilliseconds !== null);

    for(let i = 0; i < filteredComments.length; i++){
        const comment = comments.value[i];
        loadThread(comment);
    }
}

function loadThread(comment: MessageModel){
    const timeSeconds = Math.floor(comment.songTimestampMilliseconds! / 1000);
    const { totalSeconds } = audioLength.value!;
    const timeline = document.querySelector('.timeline') as HTMLElement;
    const timeLineRect = timeline.getBoundingClientRect();

    const timePercent = timeSeconds / totalSeconds;
    const position_x = timeLineRect.left + (timeLineRect.width * timePercent);
    const position_y = 0;

    let thread = threads.value.find(tg => tg.position_x === position_x);
    if (thread === undefined) {
        thread = new Thread(position_x, position_y, timeSeconds, 1);
        threads.value.push(thread);
    }
    else {
        thread.commentsCount++;
    }
}

function download() {
    const audio = document.getElementById('song-player') as HTMLAudioElement;
    const source = audio.getElementsByTagName('source')[0];
    const url = source.src;
    const a = document.createElement('a');
    a.href = url;
    a.download = (revision.value?.revisionName ?? 'audio') + '.' + (revision.value?.file?.extension ?? '');
    a.click();
}

onBeforeUnmount(() => {
    SessionStorageService.removeSessionStorageItem('currentSongRevisionId');
});

const audioLength = computed(() => {
    if(revision.value !== null) {
        return getMinutesAndSeconds(Math.floor(revision.value.lengthMilliseconds / 1000));
    }
    return null;
});

function getMinutesAndSeconds(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds - (minutes * 60));
    return { totalSeconds, minutes, seconds };
}

function handleClickForPopover(event: MouseEvent) {

    //if click within bounds of timeline 
    const section = document.getElementById('audio-section');
    const timeline = document.querySelector('.timeline');
    const popover = document.getElementById('startCommentPopover');
    const arrow = popover?.querySelector('.popover-arrow') as HTMLElement | null;

    

    if (section && timeline && popover) {
        const sectionRect = section.getBoundingClientRect();
        const timelineRect = timeline.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();
        const mousePosition = { x: event.clientX, y: event.clientY };
        
        if ((pointWithinRect(mousePosition, sectionRect) && popover.classList.contains('show')) || pointWithinRect(mousePosition, timelineRect)) {
            popover.classList.add('show');
            popover.style.left = mousePosition.x + 'px';
            popover.style.top = (timelineRect.top + 12) + 'px';
            console.log(popoverRect.width);
            if(arrow) {
                arrow.style.left = ((popoverRect.width / 2) - 8) + 'px';
            }
            const min = document.getElementById('startCommentMins');
            const sec = document.getElementById('startCommentSecs');

            const percentage = (mousePosition.x - timelineRect.left) / timelineRect.width;
            const totalSeconds = Math.floor(percentage * audioLength.value!.totalSeconds);
            const { minutes, seconds } = getMinutesAndSeconds(totalSeconds);

            if (min && sec) {
                min.innerText = padTime(minutes);
                sec.innerText = padTime(seconds);
            }
            
            return;
        } else if (!pointWithinRect(mousePosition, popoverRect!)) {
            popover.classList.remove('show');
            
        }
    }    
}

function padTime(number: number | null | undefined) {
    number = number || 0;
    return (new Array(2 + 1).join('0') + number.toString()).slice(-2);
}

function pointWithinRect(point: { x: number, y: number }, rect: { top: number, left: number, bottom: number, right: number }) {
    return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

function receiveMessage(...args: any[]) {
    const message = args[0] as MessageModel;
    message.createdAt = new Date(message.createdAt + 'Z');

    if (message.channelId != props.song.channelId || props.songRevsionId != message.songRevisionId) {
        return;
    }

    comments.value.push(message);
    formatMessages();
    loadThreads();
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


function startThread(){
    const min = document.getElementById('startCommentMins') as HTMLElement;
    const sec = document.getElementById('startCommentSecs') as HTMLElement;
    const minutes = parseInt(min.innerText);
    const seconds = parseInt(sec.innerText);
    const totalSeconds = (minutes * 60) + seconds;
    const timeSeconds = totalSeconds;
    songTimestampSeconds.value = timeSeconds;
    const form = document.getElementById('newCommentForm') as HTMLFormElement;
    form.classList.remove('d-none');

    const popover = document.getElementById('startCommentPopover');
    popover?.classList.remove('show');

}


const songTimestampSeconds = ref(null as number | null);
var newComment: string;


function createComment(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    ConnectionService.SendSongRevisionMessage(props.song.channelId, newComment, props.songRevsionId, songTimestampSeconds.value! * 1000);
    
    form.reset();
}


</script>

<style>
.audio-player {
    --plyr-audio-control-color: var(--bs-body-color );
    --plyr-audio-controls-background: var(--bs-body-bg);
}

.plyr {
    max-width: calc(100% - 52px);
}

.plyr__controls {
    display: inline-flex;
}

.timeline {
    /*display: flex;
    justify-content: center;
    align-items: center;*/
    margin-top: 20px;
    border-top: solid 2px var(--bs-body-color);
    min-height: 60px;
}
.wide-text {
    font-size: 1.5em;
    color: var(--bs-body-color);
    font-weight: lighter;
    opacity: 0.25;
}

.threadPopover {

}

</style>

<template>
    <div>
        <div id="audio-section">
            <span v-if="fileLoaded === false && downloading === false" @click="userGetFile">
                File not downloaded |
                <a  href="#">Download now</a>
            </span>
            <p v-if="downloading == true" > {{ downloadProgressPercent }}%</p>
            <div :class="fileLoaded === null ? 'invisible' : ''">
                <div class="audio-player">
                    <button title="Save Locally" @click="download" type="button" class="btn btn-primary btn-sm float-end"><i class="bi bi-download fs-5"></i></button>
                    <audio id="song-player" style="width:100%" >
                        <source src="" type="audio/wav">
                    </audio>
                </div>
                <div id="waveform"></div>
                <div class="timeline">
                    <div v-for="threadGroup in threads" :key="threadGroup.position_x">
                        <div class="popover bs-popover-auto fade show threadPopover" role="tooltip" :id="'threadCommentPopover-' + threadGroup.timeSeconds.toString()" data-popper-placement="bottom"
                             :style="`max-width:50px;
                                      position: absolute; 
                                      transform: translate(-50%, 10px);
                                      left: ${threadGroup.position_x}px;
                                      `" >
                            <div class="popover-arrow" style="position: absolute; left: 10px;">
                            </div>
                            <div class="popover-body" id="startCommentPopoverBody">
                                {{ threadGroup.commentsCount }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr />

        <form novalidate @submit="createComment" class="d-none" id="newCommentForm" >
            <input class="form-control" type="text" v-model="newComment" placeholder="Enter a comment" />
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>





    <div class="popover bs-popover-auto fade" role="tooltip" id="startCommentPopover" style="max-width:130px;position: absolute; transform: translate(-50%, 3px);" data-popper-placement="bottom">
        <div class="popover-arrow" style="position: absolute;">

        </div>
        <h3 class="popover-header text-center" id="startCommentPopoverTitle" >
            <span id="startCommentMins" contenteditable >00</span>
            <span>:</span>
            <span id="startCommentSecs" contenteditable>00</span>
        </h3>
        <div class="popover-body" id="startCommentPopoverBody">
            <button class="btn btn-primary" @click="startThread" >
                Start a comment thread here
            </button>
        </div>
    </div>
</template>

