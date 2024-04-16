export class Group {
    constructor(id: string, name: string, users: string[] = []) {
        this.id = id;
        this.name = name;
        this.users = users;
    }
    public id: string;
    public name: string;
    public users: string[] = [];
}

export class Channel {
    constructor(id: string, name: string, groupId: string) {
        this.id = id;
        this.name = name;
        this.groupId = groupId;
    }

    public groupId: string;
    public id: string;
    public name: string;
}

export class Song {
    constructor (id: string, name: string, channelId: string, createByUser: string) {
        this.id = id;
        this.name = name;
        this.channelId = channelId;
        this.createByUser = createByUser;
    }

    public id: string;
    public name: string;
    public channelId: string;
    public createByUser: string;
}

export class SongRevision {
    constructor(id: string, song: Song, createdByUser: Song, revision: number, createdDateUtc: Date, fileMetadataId: string, lengthMilliseconds: number) {
        this.id = id;
        this.song = song;
        this.createdByUser = createdByUser;
        this.revision = revision;
        this.createdDateUtc = createdDateUtc;
        this.fileMetadataId = fileMetadataId;
        this.lengthMilliseconds = lengthMilliseconds;
    }

    public id: string;
    public song: Song;
    public createdByUser: Song;
    public revision: number;
    public createdDateUtc: Date;
    public fileMetadataId: string;
    public lengthMilliseconds: number;
}

export class Message {
    constructor(id: string, user: string, dateUtc: Date, content: string, channelId: string, songRevisionId: string | null, songTimestampMilliseconds: number | null) {
        this.id = id;
        this.user = user;
        this.dateUtc = dateUtc;
        this.content = content;
        this.channelId = channelId;
        this.songRevisionId = songRevisionId;
        this.songTimestampMilliseconds = songTimestampMilliseconds;
    }

    public id: string;
    public user: string;
    public dateUtc: Date;
    public content: string;
    public channelId: string;
    public songRevisionId: string | null;
    public songTimestampMilliseconds: number | null;
}

export class FileMetadata {
    constructor(id: string, name: string, extension: string, content: string, lengthBytes: number, uploadDateUtc: Date, songRevisionId: string | null) {
        this.id = id;
        this.name = name;
        this.extension = extension;
        this.content = content;
        this.lengthBytes = lengthBytes;
        this.uploadDateUtc = uploadDateUtc;
        this.songRevisionId = songRevisionId;
    }
    
    public id: string;
    public name: string;
    public extension: string;
    public content: string;
    public lengthBytes: number;
    public uploadDateUtc: Date;
    public songRevisionId: string | null;
}