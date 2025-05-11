import type {Executor} from '../';
import type {
    ApiVo, 
    ResourcesInput, 
    ResourcesVo, 
    ResponseResult
} from '../model/static/';

export class ResourcesController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 添加资源
     */
    readonly addResources: (options: ResourcesControllerOptions['addResources']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/resources';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ResponseResult<string>>;
    }
    
    /**
     * 删除资源
     */
    readonly deleteResources: (options: ResourcesControllerOptions['deleteResources']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/resources/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<ResponseResult<string>>;
    }
    
    /**
     * 获取后端框架的全部API
     */
    readonly listApis: () => Promise<
        ResponseResult<ReadonlyArray<ApiVo>>
    > = async() => {
        let _uri = '/api/v1/resources/apis';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ResponseResult<ReadonlyArray<ApiVo>>>;
    }
    
    /**
     * 获取资源列表
     */
    readonly listResources: () => Promise<
        ResponseResult<ReadonlyArray<ResourcesVo>>
    > = async() => {
        let _uri = '/api/v1/resources/list';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ResponseResult<ReadonlyArray<ResourcesVo>>>;
    }
}

export type ResourcesControllerOptions = {
    'addResources': {
        readonly body: ResourcesInput
    }, 
    'deleteResources': {
        readonly id: number
    }, 
    'listResources': {}, 
    'listApis': {}
}
