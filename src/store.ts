import { reactive } from 'vue'
import { TokenResponse } from './services/api-account-service';

export class ApplicationUser {
    
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
        try{
            const decodedString = atob(jsonString);
            return JSON.parse(decodedString) as T;
        }
        catch{
            localStorage.removeItem(key);
            return null;
        }
    }

    private static setJsonLocalStorageItem<T>(key: string, value: T): void {
        window.dispatchEvent(new Event('userstorage'));
        const jsonString = JSON.stringify(value);
        const encodedString = btoa(jsonString);
        localStorage.setItem(key, encodedString);
    }

    public static isLoggedIn(): boolean {
        return ApplicationUser.getCurrentUser() != null;
    }
    public static setCurrentUser(user: ApplicationUser): void {
        ApplicationUser.setJsonLocalStorageItem('currentUser', user);
    }
    public static getCurrentUser(): ApplicationUser | null {
        return ApplicationUser.getJsonLocalStorageItem<ApplicationUser>('currentUser');
    }

    public static setToken(token: TokenResponse): void {
        ApplicationUser.setJsonLocalStorageItem('token', token);
    }

    public static getToken(): TokenResponse | null{
        return ApplicationUser.getJsonLocalStorageItem<TokenResponse>('token');
    }

    public static logOut(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
    }

    public readonly userName: string;
    public readonly roles: string[];
    public readonly token: TokenResponse;
}

export default reactive({
    isMobile: false,
})