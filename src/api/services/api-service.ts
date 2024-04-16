import axios, { AxiosError } from "axios";
import ApplicationUser from "@/application-user";
import ApiAccountService from "./account-service";

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

export class ApiService {
    private static async trySendRequest<T>(
        url: string,
        method: string,
        data: any
    ): Promise<T> {
        for (let i = 0; i < 2; i++) {
            try {
                const response = await apiClient.request<T>({
                    url: url,
                    method: method,
                    data: data,
                });
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401) {
                    const token = await ApiAccountService.Refresh();
                    if (token != null) {
                        apiClient.defaults.headers["Authorization"] =
              "Bearer " + token.accessToken;
                        continue;
                    }
                }
                throw error;
            }
        }
        throw new Error("Failed to refresh token");
    }
}
