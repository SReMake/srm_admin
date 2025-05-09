import type {Type} from '../enums/';

export interface ResourcesInput {
    readonly resources: string;
    readonly action?: string | undefined;
    readonly type: Type;
}
