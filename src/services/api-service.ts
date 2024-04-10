import axios from "axios";

axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers["Access-Control-Allow-Methods"] =
  "GET,PUT,POST,DELETE,PATCH,OPTIONS";

const apiAccountClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
});

class TokenResponse{
    public tokenType: string;
    public accessToken: string;
    public expiresIn: number;
    public refreshToken: string;

    constructor(tokenType: string, accessToken: string, expiresIn: number, refreshToken: string){
        this.tokenType = tokenType;
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.refreshToken = refreshToken;
    }
}

export default class ApiAccountService {
  public static async Login(username: string, password: string): Promise<any> {
    const url = "/account/login";
    try {
        const response = await apiAccountClient.post(url, { username, password });
        const data : TokenResponse = response.data;
        return "Logged in successfully!";
    }
    catch (e: any) {
      console.log(e);
      const errors: string[] = [];
      Object.keys(e.response.data.errors).forEach((key) => {
        if(key != "$")
            errors.push(((e.response.data.errors as any)[key]).join("\n"));
      });
      return errors;
    }
  }
}

