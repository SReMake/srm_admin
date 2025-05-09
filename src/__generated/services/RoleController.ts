import type {Executor} from '../';
import type {Dynamic_Role} from '../model/dynamic/';
import type {
    ResponseResult, 
    ResponseResultPage, 
    RoleSearchInput, 
    UpdateRoleInput
} from '../model/static/';

export class RoleController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 添加角色
     */
    readonly addRole: (options: RoleControllerOptions['addRole']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/role';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ResponseResult<string>>;
    }
    
    /**
     * 删除角色
     */
    readonly deleteRole: (options: RoleControllerOptions['deleteRole']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/role/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<ResponseResult<string>>;
    }
    
    /**
     * 获取角色列表
     */
    readonly listRole: (options: RoleControllerOptions['listRole']) => Promise<
        ResponseResultPage<Dynamic_Role>
    > = async(options) => {
        let _uri = '/api/v1/role/list';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.role.id;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'id='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.role.name;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'name='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.role.createAtStart;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'createAtStart='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.role.updateAtStart;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'updateAtStart='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.role.createAtEnd;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'createAtEnd='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.role.updateAtEnd;
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
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ResponseResultPage<Dynamic_Role>>;
    }
    
    /**
     * 更新角色
     */
    readonly updateRole: (options: RoleControllerOptions['updateRole']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/role/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<ResponseResult<string>>;
    }
}

export type RoleControllerOptions = {
    'addRole': {
        readonly body: UpdateRoleInput
    }, 
    'deleteRole': {
        readonly id: number
    }, 
    'updateRole': {
        readonly id: number, 
        readonly body: UpdateRoleInput
    }, 
    'listRole': {
        readonly page?: number | undefined, 
        readonly size?: number | undefined, 
        readonly role: RoleSearchInput
    }
}
