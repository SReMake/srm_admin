import type {Executor} from '../';
import type {
    ResponseResult, 
    ResponseResultPage, 
    UpdateUserInput, 
    UserInput, 
    UserSearchInput, 
    UserVo
} from '../model/static/';

export class UserController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 添加用户
     */
    readonly addUser: (options: UserControllerOptions['addUser']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/user';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ResponseResult<string>>;
    }
    
    /**
     * 禁用账户
     */
    readonly disableUser: (options: UserControllerOptions['disableUser']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/user/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<ResponseResult<string>>;
    }
    
    /**
     * 启用账户
     */
    readonly enableUser: (options: UserControllerOptions['enableUser']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/user/';
        _uri += encodeURIComponent(options.id);
        _uri += '/enable';
        return (await this.executor({uri: _uri, method: 'PUT'})) as Promise<ResponseResult<string>>;
    }
    
    /**
     * 查看用户列表
     */
    readonly listUser: (options: UserControllerOptions['listUser']) => Promise<
        ResponseResultPage<UserVo>
    > = async(options) => {
        let _uri = '/api/v1/user/list';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.params.id;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'id='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.params.username;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'username='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.params.phone;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'phone='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.params.status;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'status='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.params.createAtStart;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'createAtStart='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.params.updateAtStart;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'updateAtStart='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.params.createAtEnd;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'createAtEnd='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.params.updateAtEnd;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'updateAtEnd='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.page;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'page='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.size;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'size='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ResponseResultPage<UserVo>>;
    }
    
    /**
     * 更新用户信息
     */
    readonly updateUser: (options: UserControllerOptions['updateUser']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/user/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<ResponseResult<string>>;
    }
}

export type UserControllerOptions = {
    'addUser': {
        readonly body: UserInput
    }, 
    'listUser': {
        readonly page?: number | undefined, 
        readonly size?: number | undefined, 
        readonly params: UserSearchInput
    }, 
    'updateUser': {
        readonly id: number, 
        readonly body: UpdateUserInput
    }, 
    'disableUser': {
        readonly id: number
    }, 
    'enableUser': {
        readonly id: number
    }
}
