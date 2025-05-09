import type {Executor} from '../';
import type {
    JobInput, 
    JobLogVo, 
    JobSearchInput, 
    JobVo, 
    Page, 
    ResponseResult
} from '../model/static/';

export class TaskManagerService {
    
    constructor(private executor: Executor) {}
    
    readonly listJobLogs: (options: TaskManagerServiceOptions['listJobLogs']) => Promise<
        ResponseResult<Page<JobLogVo>>
    > = async(options) => {
        let _uri = '/api/v1/tasks/list/logs/';
        _uri += encodeURIComponent(options.group);
        _uri += '/';
        _uri += encodeURIComponent(options.name);
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
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
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ResponseResult<Page<JobLogVo>>>;
    }
    
    readonly listJobs: (options: TaskManagerServiceOptions['listJobs']) => Promise<
        ResponseResult<Page<JobVo>>
    > = async(options) => {
        let _uri = '/api/v1/tasks/list';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
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
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ResponseResult<Page<JobVo>>>;
    }
    
    readonly scheduleTask: (options: TaskManagerServiceOptions['scheduleTask']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/tasks/schedule';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ResponseResult<string>>;
    }
    
    readonly unscheduleTask: (options: TaskManagerServiceOptions['unscheduleTask']) => Promise<
        ResponseResult<string>
    > = async(options) => {
        let _uri = '/api/v1/tasks/unschedule/';
        _uri += encodeURIComponent(options.group);
        _uri += '/';
        _uri += encodeURIComponent(options.name);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<ResponseResult<string>>;
    }
}

export type TaskManagerServiceOptions = {
    'scheduleTask': {
        readonly body: JobInput
    }, 
    'unscheduleTask': {
        readonly group: string, 
        readonly name: string
    }, 
    'listJobs': {
        readonly page?: number | undefined, 
        readonly size?: number | undefined, 
        readonly params?: JobSearchInput | undefined
    }, 
    'listJobLogs': {
        readonly page?: number | undefined, 
        readonly size?: number | undefined, 
        readonly group: string, 
        readonly name: string
    }
}
