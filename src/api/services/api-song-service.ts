import type { Song } from "../models";
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
    public async addUserToSong(songId: string, userName: string) {
        await ApiService.post<Song>(`/songs/${songId}/users/${userName}`);
    }
}

export default new ApiSongService();