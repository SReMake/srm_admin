import type {Executor} from '../';
import type {ResourcesInput, ResponseResult} from '../model/static/';

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
}

export type ResourcesControllerOptions = {
    'addResources': {
        readonly body: ResourcesInput
    }, 
    'deleteResources': {
        readonly id: number
    }
}
