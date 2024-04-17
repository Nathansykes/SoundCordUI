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

    public static start() {
        this.connection.start()
            .catch((err) => console.error(err));
    }

    public static stop() {
        this.connection.stop()
            .catch((err) => console.error(err));
    }

    public static on(event: string, callback: (...args: any[]) => void) {
        this.connection.on(event, callback);
    }

    public static off(event: string, callback: (...args: any[]) => void) {
        this.connection.off(event, callback);
    }
    
    public static send(method: string, ...args: any[]) {
        this.connection.send(method, ...args)
            .catch((err) => console.error(err));
    }
    
    public static ConnectToChannel(channelId: string) {
        this.send("ConnectToChannel", new channelRequest(channelId));
    }

    public static DisconnectFromChannel(channelId: string) {
        this.send("DisconnectFromChannel", new channelRequest(channelId));
    }

    public static SendMessage(channelId: string, content: string) {
        this.send("Message", new messageRequest(channelId, content));
    }
}

class channelRequest
{
    constructor(channelId: string) {
        this.channelId = channelId;
    }
    channelId: string;
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