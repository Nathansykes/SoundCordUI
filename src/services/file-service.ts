import { file, dir, write } from 'opfs-tools';
import { FileMetadata, type Message } from "@/api/models";
import ApiService from "@/api/services/api-service";
import type { onProgress } from "@/api/services/api-service";
import apiService from '@/api/services/api-service';
import axios from 'axios';
import ApplicationUser from '@/application-user';

export class FileService {

    constructor (directory: string) {
        this.directory = directory;
        this.getOrCreateDirectory(directory);
    }

    public directory: string;

    public static async blobToBase64DataUri(blob: Blob) : Promise<string> {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => {

                

                resolve(reader.result as string);
            } 
            reader.readAsDataURL(blob);
        });
    }

    public static async blobToBase64Content(blob: Blob) : Promise<string> {
        const fullString = await FileService.blobToBase64DataUri(blob);
        return fullString.substring(fullString.indexOf(',') + 1);
    }
    
    public static base64DataUriToBlob(dataUri: string, sliceSize: number = 512) : Blob {
        // data:{contentType};base64,{base64Data}
        const BASE64_MARKER = ';base64,';
        const base64Index = dataUri.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        const b64Data = dataUri.substring(base64Index);
        const contentType = dataUri.substring(5, base64Index - BASE64_MARKER.length);
        
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
    
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
    
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
    
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    private getPath(fileName: string) : string {
        return `/${this.directory}/${fileName}`;
    }

    public async fileExists(fileName: string) : Promise<boolean> {
        
        return await file(this.getPath(fileName)).exists();
    }

    public async writeFile(fileName: string, content: string) : Promise<void> {
        await write(this.getPath(fileName), content);
    }

    public async deleteFile(fileName: string) : Promise<void> {
        await file(this.getPath(fileName)).remove();
    }

    public async getOrCreateDirectory(path: string) : Promise<void> {
        await dir(path).create();
    }

    public async getFile(fileName: string) : Promise<string> {
        return await file(this.getPath(fileName)).text();
    }

    public static async downloadFile(fileMetadataId: string, downloadProgress: onProgress = null): Promise<FileMetadata> {
        const metaPath = `/files/download/${fileMetadataId}/meta`;
        const contentPath = `/files/download/${fileMetadataId}/content`;

        const meta = await ApiService.post<FileMetadata>(metaPath, null, null);


        const client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + ApplicationUser.getToken()?.accessToken,
            },
            responseType: 'blob',
        });

        const blob = await ApiService.useClient(client).post<Blob>(contentPath, null, null, downloadProgress);
        apiService.useDefaultClient();



        meta.content = await FileService.blobToBase64Content(blob);
        return meta;
    }
}

