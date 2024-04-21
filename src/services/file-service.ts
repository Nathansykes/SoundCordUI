import { file, dir, write } from 'opfs-tools';

export class FileService {

    constructor (directory: string) {
        this.directory = directory;
        this.getOrCreateDirectory(directory);
    }

    public directory: string;

    
    static base64DataUriToBlob(dataUri: string, sliceSize: number = 512) : Blob {
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

    async fileExists(fileName: string) : Promise<boolean> {
        
        return await file(this.getPath(fileName)).exists();
    }

    async writeFile(fileName: string, content: string) : Promise<void> {
        await write(this.getPath(fileName), content);
    }

    async deleteFile(fileName: string) : Promise<void> {
        await file(this.getPath(fileName)).remove();
    }

    async getOrCreateDirectory(path: string) : Promise<void> {
        await dir(path).create();
    }

    async getFile(fileName: string) : Promise<string> {
        return await file(this.getPath(fileName)).text();
    }
}

