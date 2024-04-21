export class IdNameModel {
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public id: string;
    public name: string;

}

export class Group {
    constructor(id: string, groupName: string, users: string[] = []) {
        this.id = id;
        this.groupName = groupName;
        this.users = users;
    }
    public id: string;
    public groupName: string;
    public users: string[] = [];
    public createdByUser: string | null = null;
}

export class Channel {
    constructor(id: string, channelName: string, groupId: string, song: IdNameModel | null = null) {
        this.id = id;
        this.channelName = channelName;
        this.groupId = groupId;
        this.song = song;
    }
    
    public groupId: string;
    public id: string;
    public channelName: string;
    public song: IdNameModel | null = null;
}


export class Song {
    constructor (id: string, songName: string, channelId: string, createByUser: string) {
        this.id = id;
        this.songName = songName;
        this.channelId = channelId;
        this.createByUser = createByUser;
    }

    public id: string;
    public songName: string;
    public channelId: string;
    public createByUser: string;
}

export class SongRevision {
    constructor(id: string, songId: string, createdByUser: Song, revisionName: string, createdUtc: Date, fileMetadataId: string, lengthMilliseconds: number, file: FileMetadata | null = null) {
        this.id = id;
        this.songId = songId;
        this.createdByUser = createdByUser;
        this.revisionName = revisionName;
        this.createdUtc = createdUtc;
        this.fileMetadataId = fileMetadataId;
        this.lengthMilliseconds = lengthMilliseconds;
        this.file = file;
    }

    public id: string;
    public songId: string;
    public createdByUser: Song;
    public revisionName: string;
    public createdUtc: Date;
    public fileMetadataId: string;
    public lengthMilliseconds: number;
    public file: FileMetadata | null = null;
}

export class Message {
    constructor(id: string, user: string, createdAt: Date, content: string, channelId: string, songRevisionId: string | null, songTimestampMilliseconds: number | null) {
        this.id = id;
        this.user = user;
        this.createdAt = createdAt;
        this.content = content;
        this.channelId = channelId;
        this.songRevisionId = songRevisionId;
        this.songTimestampMilliseconds = songTimestampMilliseconds;
    }

    public id: string;
    public user: string;
    public createdAt: Date;
    public content: string;
    public channelId: string;
    public songRevisionId: string | null;
    public songTimestampMilliseconds: number | null;
}

export class FileMetadata {
    constructor(id: string, fileName: string, extension: string, content: string | null, contentLength: number | null, contentType: string | null, uploadedUtc: Date, uploadedByUser: string) {
        this.id = id;
        this.fileName = fileName;
        this.extension = extension;
        this.content = content;
        this.contentLength = contentLength;
        this.contentType = contentType;
        this.uploadedUtc = uploadedUtc;
        this.uploadedByUser = uploadedByUser;
    }
    
    public id: string;
    public fileName: string;
    public extension: string;
    public content: string | null;
    public contentLength: number | null;
    public contentType: string | null;
    public uploadedUtc: Date;
    public uploadedByUser: string;

    static toDataUriString(file: FileMetadata) : string {
        return `data:${file.contentType};base64,${file.content}`;
    }
}