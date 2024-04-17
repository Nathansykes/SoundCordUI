import type { Message } from "../models";
import ApiService from "./api-service";

class ApiMessageService {
    public async getMessages(channelId: string) : Promise<Message[]>  {
        return await ApiService.get<Message[]>(`/messages/${channelId}`);
    }
}

export default new ApiMessageService();