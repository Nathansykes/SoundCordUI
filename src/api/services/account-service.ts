import axios from "axios";
import ApplicationUser from '@/application-user';

axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers["Access-Control-Allow-Methods"] =
  "GET,PUT,POST,DELETE,PATCH,OPTIONS";

const apiAccountClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

export class TokenResponse {
    public tokenType: string;
    public accessToken: string;
    public expiresIn: number;
    public refreshToken: string;

    constructor(
        tokenType: string,
        accessToken: string,
        expiresIn: number,
        refreshToken: string
    ) {
        this.tokenType = tokenType;
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.refreshToken = refreshToken;
    }
}

export class UserInfoModel{
    public userName: string;
    public roles: string[];
    
    constructor(userName: string, roles: string[]){
        this.userName = userName;
        this.roles = roles;
    }
}

export class AccountActionResult {
    public success: boolean;
    public errors: string[];

    constructor(success: boolean, errors: string[]) {
        this.success = success;
        this.errors = errors;
    }
}

export class ApiAccountService {
    private async LoginPrivate(
        username: string,
        password: string
    ): Promise<TokenResponse> {
        const url = "/account/login";
        const response = await apiAccountClient.post(url, { username, password });
        const data: TokenResponse = response.data;
        return data;
    }

    private async RegisterPrivate(
        username: string,
        email: string,
        password: string
    ): Promise<void> {
        const url = "/account/register";
        await apiAccountClient.post(url, { username, email, password });
    }

    private Failure(e: any): AccountActionResult {
        const errors: string[] = [];
        if(e.response.data && e.response.data.errors){
            Object.keys(e.response.data.errors).forEach((key) => {
                if (key != "$")
                    errors.push((e.response.data.errors as any)[key].join("\n"));
            });
        }
        return new AccountActionResult(false, errors);
    }

    public async ForgotPassword(username: string): Promise<AccountActionResult> {
        try {
            const url = "/account/forgotpassword";
            await apiAccountClient.post(url, { username });
            return new AccountActionResult(true, []);
        } catch(e : any){
            return this.Failure(e);
        }
    }

    public async ResetPassword(username: string, token: string, newPassword: string): Promise<AccountActionResult> {
        try {
            const url = "/account/resetpassword";
            await apiAccountClient.post(url, { username, token, newPassword });
            return new AccountActionResult(true, []);
        } catch(e : any){
            return this.Failure(e);
        }
    }

    public async GetUserDetails(): Promise<UserInfoModel> {
        const url = "/account/user";
        const token = ApplicationUser.getToken()!;
        const response = await apiAccountClient.get(url, {
            headers: { Authorization: `Bearer ${token?.accessToken}` },
        });

        const data: UserInfoModel = response.data;
        ApplicationUser.setCurrentUser(new ApplicationUser(data.userName, data.roles, token));
        return data;
    }

    public async Refresh(): Promise<TokenResponse> {
        const url = "/account/refresh";

        const token = ApplicationUser.getToken();

        const response = await apiAccountClient.post(url, {
            refreshToken: token?.refreshToken,
        }, { headers: { Authorization: `Bearer ${token?.accessToken}` } });
        const newToken: TokenResponse = response.data;
        ApplicationUser.setToken(newToken);
    
        await this.GetUserDetails();

        return newToken;
    }

    public async Login(username: string, password: string): Promise<AccountActionResult> {
        try {
            const token = await this.LoginPrivate(username, password);
            ApplicationUser.setToken(token);
            await this.GetUserDetails();
            return new AccountActionResult(true, []);
        } catch (e: any) {
            return this.Failure(e);
        }
    }

    public async Register( username: string, email: string, password: string): Promise<AccountActionResult> {
        try {
            await this.RegisterPrivate(username, email, password);
            return new AccountActionResult(true, []);
        } catch (e: any) {
            return this.Failure(e);
        }
    }
}

export default new ApiAccountService();
