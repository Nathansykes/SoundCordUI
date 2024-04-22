import ApplicationUser from "@/application-user";
import * as signalR from "@microsoft/signalr";

export default class ConnectionService {
    private static connection: signalR.HubConnection;
    private static isInitialized: boolean = false;

    public static init() {
        if(!this.isInitialized){

            const options : signalR.IHttpConnectionOptions = {
                withCredentials: false,
                accessTokenFactory: () => ApplicationUser.getToken()!.accessToken,
            };
            
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(import.meta.env.VITE_HUB_URL, options)
                .configureLogging(signalR.LogLevel.Error)
                .build();
            this.isInitialized = true;
        }
    }

    public static async start() : Promise<boolean> {
        try {
            if(this.connection.state !== signalR.HubConnectionState.Connected) {
                await this.connection.start();
            }
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public static async stop() : Promise<boolean> {
        try {
            await this.connection.stop();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public static on(event: string, callback: (...args: any[]) => void) {
        this.connection.on(event, callback);
    }

    public static off(event: string, callback: (...args: any[]) => void) {
        this.connection.off(event, callback);
    }
    
    public static async send(method: string, ...args: any[]) {
        try {
            await this.connection.send(method, ...args);
        } catch (error) {
            console.error(error);
        }
    }
    
    public static async ConnectToChannel(channelId: string) {
        try {
            await this.send("ConnectToChannel", new channelRequest(channelId));
        }
        catch(error) {
            console.error(error);
        }
    }

    public static async DisconnectFromChannel(channelId: string) {
        try {
            await this.send("DisconnectFromChannel", new channelRequest(channelId));
        }
        catch(error) {
            console.error(error);
        }
    }

    public static async SendMessage(channelId: string, content: string) {
        try {
            await this.send("Message", new messageRequest(channelId, content));
        } catch (error) {
            console.error(error);
        }
    }

    public static async SendSongRevisionMessage(channelId: string, content: string, songRevisionId: string, songTimestampMilliseconds: number) {
        try {
            await this.send("Message", new songRevisionTimeStampRequest(channelId, content, songRevisionId, songTimestampMilliseconds));
        } catch (error) {
            console.error(error);
        }
    }
}

class channelRequest
{
    constructor(channelId: string) {
        this.channelId = channelId;
    }
    channelId: string;
}

class songRevisionTimeStampRequest {
    
    constructor(channelId: string, content: string, songRevisionId: string, songTimestampMilliseconds: number) {
        this.channelId = channelId;
        this.message = new songRevisionTimeStampMessageRequest(content, songRevisionId, songTimestampMilliseconds);}

    channelId: string;
    message: songRevisionTimeStampMessageRequest;
}

class songRevisionTimeStampMessageRequest {

    constructor(content: string, songRevisionId: string, songTimestampMilliseconds: number) {
        this.content = content;
        this.songRevisionId = songRevisionId;
        this.songTimestampMilliseconds = songTimestampMilliseconds;
    }
    
    content: string;
    songRevisionId: string
    songTimestampMilliseconds: number;
}

class messageRequest {
    
    constructor(channelId: string, content: string) {
        this.channelId = channelId;
        this.message = new messageObj(content);
    }

    channelId: string;
    message: messageObj;
}

class messageObj {
    constructor(content: string) {
        this.content = content;
    }

    content: string;
}