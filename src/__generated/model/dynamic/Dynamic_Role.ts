import type {Dynamic_User} from './';

export interface Dynamic_Role {
    readonly id?: number;
    readonly createAt?: string;
    readonly updateAt?: string | undefined;
    readonly createBy?: Dynamic_User | undefined;
    readonly updateBy?: Dynamic_User | undefined;
    readonly name?: string;
}
