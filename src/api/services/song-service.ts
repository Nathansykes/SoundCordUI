import type { Song, SongRevision } from "../models";
import ApiService from "./api-service";

class ApiSongService {
    public async getSongs(groupId: string) : Promise<Song[]>  {
        return await ApiService.get<Song[]>(`/groups/${groupId}/songs`);
    }
    public async getSong(id: string) : Promise<Song>  {
        return await ApiService.get<Song>(`/songs/${id}`);
    }
    public async createSong(groupId: string, songName: string) : Promise<Song> {
        return await ApiService.post<Song>(`/groups/${groupId}/songs`, { songName });
    }

    public async getSongRevisions(songId: string) : Promise<SongRevision[]>  {
        return await ApiService.get<SongRevision[]>(`/songs/${songId}/revisions`);
    }

    public async getSongRevision(songId: string, revisionId: string) : Promise<SongRevision>  {
        return await ApiService.get<SongRevision>(`/songs/${songId}/revisions/${revisionId}`);
    }

    public async createSongRevision(songId: string, revisionName: string, fileName: string, base64Content: string, lengthMilliseconds: number) : Promise<SongRevision> {
        
        const parts = fileName.split(".");
        
        const extension = parts.pop();
        const fileNameWithoutExtension = parts.join(".");
        const data = {
            songRevision: {
                revisionName: revisionName,
                lengthMilliseconds: lengthMilliseconds
            },
            file: {
                fileName: fileNameWithoutExtension,
                extension: extension,
                content: base64Content
            }
        }
        
        
        return await ApiService.post<SongRevision>(`/songs/${songId}/revisions`, data);
    }
}


export default new ApiSongService();