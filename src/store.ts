import { reactive } from 'vue'

export class ApplicationUser {
    
    constructor(userName: string, roles: string[]) {
        this.userName = userName;
        this.roles = roles;
    }

    public userName: string;
    public roles :string[];
}

export default reactive({
    isMobile: false,
    isLoggedIn: false,
    currentUser: undefined as (ApplicationUser | undefined),
})