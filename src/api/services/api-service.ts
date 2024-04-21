import axios, { AxiosError, type AxiosInstance, type AxiosProgressEvent } from "axios";
import ApplicationUser from "@/application-user";
import ApiAccountService from "./account-service";
import router from "@/router";
import type { FileMetadata } from "../models";

axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers["Access-Control-Allow-Methods"] =
  "GET,PUT,POST,DELETE,PATCH,OPTIONS";


export type onProgress = ((event: AxiosProgressEvent) => void) | null;

class ApiService {

    constructor() { 
        this.initClient();
    }

    private initClient() {
        this.apiJSONClient = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + ApplicationUser.getToken()?.accessToken,
            },
            transformResponse: (data) =>
                JSON.parse(data, (key, value) => {
                    if (key.toLowerCase().endsWith('at') 
                            || key.toLowerCase().includes('utc') 
                            || key.toLowerCase().includes('date')) {
                        
                        const date = new Date(value);
                        if (isNaN(date.getDate())) {
                            return value;
                        }
                        if(!value.endsWith('Z')) {
                            value = value + 'Z';
                        }
                        return new Date(value);
                    }
                    return value;
                })
        });
    }

    private apiJSONClient!: AxiosInstance;
    
    private async sendRequest<T>(url: string, method: string, data: any | null, uploadProgress: onProgress = null, downloadProgress: onProgress = null): Promise<T> {
        
        const request = {
            url: url,
            method: method,
            data: data,
            onUploadProgress (event : AxiosProgressEvent) {
                if (uploadProgress != null){
                    uploadProgress(event);
                }
            },
            onDownloadProgress (event : AxiosProgressEvent) {
                if (downloadProgress != null){
                    downloadProgress(event);
                }
            }
        }
        return (await this.apiJSONClient.request<T>(request)).data;
    }
    
    private async trySendRequest<T>(
        url: string,
        method: string,
        data: any,
        uploadProgress: onProgress = null, 
        downloadProgress: onProgress = null
    ): Promise<T> {
        try {
            return await this.sendRequest<T>(url, method, data, uploadProgress, downloadProgress);
        } catch (error) {
            const axiosError = error as AxiosError;
            try {
                if (axiosError.response?.status === 401) {
                    const token = await ApiAccountService.Refresh();
                    if (token != null) {
                        this.apiJSONClient.defaults.headers["Authorization"] = "Bearer " + token.accessToken;
                        return await this.sendRequest<T>(url, method, data, uploadProgress, downloadProgress);
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

    public async get<T>(url: string, data: any | null = null, uploadProgress: onProgress = null, downloadProgress: onProgress = null): Promise<T> {
        return await this.trySendRequest<T>(url, "GET", data, uploadProgress, downloadProgress);
    }

    public async post<T>(url: string, data: any | null = null, uploadProgress: onProgress = null, downloadProgress: onProgress = null): Promise<T> {
        return await this.trySendRequest<T>(url, "POST", data, uploadProgress, downloadProgress);
    }

    public useClient(client: AxiosInstance) : ApiService {
        this.apiJSONClient = client;
        return this;
    }

    public useDefaultClient() : ApiService {
        this.initClient();
        return this;
    }
}

export default new ApiService();