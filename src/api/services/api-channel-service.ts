import type { Channel } from "../models";
import ApiService from "./api-service";

class ApiChannelService {
    public async getChannels(groupId: string) : Promise<Channel[]>  {
        return await ApiService.get<Channel[]>(`/groups/${groupId}/channels`);
    }
    public async getChannel(id: string) : Promise<Channel>  {
        return await ApiService.get<Channel>(`/channels/${id}`);
    }
    public async createChannel(groupId: string, channelName: string) : Promise<Channel> {
        return await ApiService.post<Channel>(`/groups/${groupId}/channels`, { channelName });
    }
    public async addUserToChannel(channelId: string, userName: string) {
        await ApiService.post<Channel>(`/channels/${channelId}/users/${userName}`);
    }
}

export default new ApiChannelService();