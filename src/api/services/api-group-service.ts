import type { Group } from "../models";
import ApiService from "./api-service";

class ApiGroupService {
    public async getGroups() : Promise<Group[]>  {
        return await ApiService.get<Group[]>("/groups");
    }
    public async getGroup(id: string) : Promise<Group>  {
        return await ApiService.get<Group>(`/groups/${id}`);
    }
    public async createGroup(group: Group) : Promise<Group> {
        return await ApiService.post<Group>("/groups", group);
    }
    public async addUserToGroup(groupId: string, userName: string) {
        await ApiService.post<Group>(`/groups/${groupId}/users/${userName}`);
    }
}

export default new ApiGroupService();