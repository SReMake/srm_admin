import type {Executor} from '../';
import type {ResponseResult, RoleVo} from '../model/static/';

export class UserRoleController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 给用户赋予角色
     */
    readonly addUserRoles: (options: UserRoleControllerOptions['addUserRoles']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/userRole/';
        _uri += encodeURIComponent(options.userId);
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ResponseResult<string>>;
    }
    
    /**
     * 删除用户的角色
     */
    readonly deleteUserRoles: (options: UserRoleControllerOptions['deleteUserRoles']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/userRole/';
        _uri += encodeURIComponent(options.userId);
        return (await this.executor({uri: _uri, method: 'DELETE', body: options.body})) as Promise<ResponseResult<string>>;
    }
    
    /**
     * 查看当前用户角色
     */
    readonly listUserRole: () => Promise<
        ResponseResult<ReadonlyArray<RoleVo>>
    > = async() => {
        let _uri = '/api/v1/userRole';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ResponseResult<ReadonlyArray<RoleVo>>>;
    }
}

export type UserRoleControllerOptions = {
    'addUserRoles': {
        readonly userId: number, 
        readonly body: ReadonlyArray<number>
    }, 
    'deleteUserRoles': {
        readonly userId: number, 
        readonly body: ReadonlyArray<number>
    }, 
    'listUserRole': {}
}
