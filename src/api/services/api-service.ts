import axios, { AxiosError } from "axios";
import ApplicationUser from "@/application-user";
import ApiAccountService from "./account-service";
import router from "@/router";

axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers["Access-Control-Allow-Methods"] =
  "GET,PUT,POST,DELETE,PATCH,OPTIONS";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + ApplicationUser.getToken()?.accessToken,
    },
});

class ApiService {
    
    private async sendRequest<T>(url: string, method: string, data: any | null): Promise<T> {
        return (await apiClient.request<T>({ url: url, method: method, data: data })).data;
    }
    
    private async trySendRequest<T>(
        url: string,
        method: string,
        data: any
    ): Promise<T> {
        try {
            return await this.sendRequest<T>(url, method, data);
        } catch (error) {
            const axiosError = error as AxiosError;
            try {
                if (axiosError.response?.status === 401) {
                    const token = await ApiAccountService.Refresh();
                    if (token != null) {
                        apiClient.defaults.headers["Authorization"] = "Bearer " + token.accessToken;
                        return await this.sendRequest<T>(url, method, data);
                    }
                }
            } catch (refreshError) {
                ApplicationUser.logOut();
                window.location.href = router.resolve("/account/login").href;
                throw refreshError;
            }
            throw error;
        }
    }

    public async get<T>(url: string, data: any | null = null): Promise<T> {
        return await this.trySendRequest<T>(url, "GET", data);
    }

    public async post<T>(url: string, data: any | null = null): Promise<T> {
        return await this.trySendRequest<T>(url, "POST", data);
    }
}

export default new ApiService();