import type { Group } from './api/models';
import { TokenResponse } from './api/services/account-service';


export default class ApplicationUser {

    constructor(userName: string, roles: string[], token: TokenResponse) {
        this.userName = userName;
        this.roles = roles;
        this.token = token;
    }

    private static getJsonLocalStorageItem<T>(key: string): T | null {
        const jsonString = localStorage.getItem(key);
        if (jsonString == null) {
            return null;
        }
        try {
            const decodedString = atob(jsonString);
            return JSON.parse(decodedString) as T;
        }
        catch {
            localStorage.removeItem(key);
            return null;
        }
    }

    private static setJsonLocalStorageItem<T>(key: string, value: T): void {
        window.dispatchEvent(new CustomEvent('userstorage', { detail: { key, value } }));
        const jsonString = JSON.stringify(value);
        const encodedString = btoa(jsonString);
        localStorage.setItem(key, encodedString);
    }

    private static removeLocalStorageItem(key: string): void {
        localStorage.removeItem(key);
        window.dispatchEvent(new CustomEvent('userstorage', { detail: { key } }));
    }

    public static isLoggedIn(): boolean {
        return ApplicationUser.getCurrentUser() != null;
    }

    public static logOut(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
    }

    public static getToken(): TokenResponse | null {
        return ApplicationUser.getJsonLocalStorageItem<TokenResponse>('token');
    }

    public static setToken(token: TokenResponse): void {
        ApplicationUser.setJsonLocalStorageItem('token', token);
    }



    public static setCurrentUser(user: ApplicationUser): void {
        ApplicationUser.setJsonLocalStorageItem('currentUser', user);
    }
    public static getCurrentUser(): ApplicationUser | null {
        return ApplicationUser.getJsonLocalStorageItem<ApplicationUser>('currentUser');
    }

    public static getCurrentGroup(): Group | null{
        return ApplicationUser.getJsonLocalStorageItem<Group>('currentGroup');
    }

    public static setCurrentGroup(group: Group): void {
        ApplicationUser.setJsonLocalStorageItem('currentGroup', group);
    }

    public static removeCurrentGroup(): void {
        ApplicationUser.removeLocalStorageItem('currentGroup');
    }


    public readonly userName: string;
    public readonly roles: string[];
    public readonly token: TokenResponse;
}
