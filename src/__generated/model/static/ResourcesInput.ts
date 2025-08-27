import type {Type} from '../enums/';

export interface ResourcesInput {
    /**
     * 前端页面文件地址或者后端api接口
     */
    readonly resources?: string | undefined;
    readonly name?: string | undefined;
    readonly action?: string | undefined;
    readonly type: Type;
    /**
     * 前端路由地址
     */
    readonly path?: string | undefined;
    readonly parentId?: number | undefined;
}
