
export default class SessionStorageService {
    public static getJsonSessionStorageItem<T>(key: string): T | null {
        const jsonString = sessionStorage.getItem(key);
        if (jsonString == null) {
            return null;
        }
        try {
            const decodedString = atob(jsonString);
            return JSON.parse(decodedString) as T;
        }
        catch {
            sessionStorage.removeItem(key);
            return null;
        }
    }

    public static setJsonSessionStorageItem<T>(key: string, value: T): void {
        window.dispatchEvent(new CustomEvent('sessionstorage', { detail: { key, value } }));
        const jsonString = JSON.stringify(value);
        const encodedString = btoa(jsonString);
        sessionStorage.setItem(key, encodedString);
    }

    public static setSessionStorageItem(key: string, value: string): void {
        window.dispatchEvent(new CustomEvent('sessionstorage', { detail: { key, value } }));
        sessionStorage.setItem(key , value);
    }

    public static getSessionStorageItem(key: string): string | null {
        return sessionStorage.getItem(key);
    }
}