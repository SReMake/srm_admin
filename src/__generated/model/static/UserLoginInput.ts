export interface UserLoginInput {
    readonly username: string;
    readonly password: string;
    readonly captcha?: string | undefined;
    readonly captchaId?: string | undefined;
}
