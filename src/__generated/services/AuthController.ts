import type {Executor} from '../';
import type {
    CaptchaVo, 
    JwtVo, 
    ResponseResult, 
    UserLoginInput
} from '../model/static/';

export class AuthController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 获取验证码
     */
    readonly captcha: () => Promise<
        ResponseResult<CaptchaVo>
    > = async() => {
        let _uri = '/api/v1/auth/captcha';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ResponseResult<CaptchaVo>>;
    }
    
    /**
     * 登入
     */
    readonly login: (options: AuthControllerOptions['login']) => Promise<
        ResponseResult<JwtVo>
    > = async(options) => {
        let _uri = '/api/v1/auth/login';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ResponseResult<JwtVo>>;
    }
    
    /**
     * 免验证码登入
     */
    readonly loginWithoutCaptcha: (options: AuthControllerOptions['loginWithoutCaptcha']) => Promise<
        ResponseResult<JwtVo>
    > = async(options) => {
        let _uri = '/api/v1/auth/loginWithoutCaptcha';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ResponseResult<JwtVo>>;
    }
    
    /**
     * 注销
     */
    readonly logout: () => Promise<
        ResponseResult<string>
    > = async() => {
        let _uri = '/api/v1/auth/logout';
        return (await this.executor({uri: _uri, method: 'POST'})) as Promise<ResponseResult<string>>;
    }
}

export type AuthControllerOptions = {
    'login': {
        readonly body: UserLoginInput
    }, 
    'loginWithoutCaptcha': {
        readonly body: UserLoginInput
    }, 
    'captcha': {}, 
    'logout': {}
}
