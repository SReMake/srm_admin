import type {Executor} from '../';
import type {ResponseResult} from '../model/static/';

export class RoleResourcesController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 授权角色资源
     */
    readonly grantRoleResources: (options: RoleResourcesControllerOptions['grantRoleResources']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/roleResources/grant/';
        _uri += encodeURIComponent(options.roleId);
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<ResponseResult<string>>;
    }
    
    /**
     * 撤销角色资源授权
     */
    readonly revokeRoleResources: (options: RoleResourcesControllerOptions['revokeRoleResources']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/roleResources/revoke/';
        _uri += encodeURIComponent(options.roleId);
        return (await this.executor({uri: _uri, method: 'DELETE', body: options.body})) as Promise<ResponseResult<string>>;
    }
}

export type RoleResourcesControllerOptions = {
    'grantRoleResources': {
        readonly roleId: number, 
        readonly body: ReadonlyArray<number>
    }, 
    'revokeRoleResources': {
        readonly roleId: number, 
        readonly body: ReadonlyArray<number>
    }
}
