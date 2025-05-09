import type {Status} from '../enums/';

export interface Dynamic_User {
    readonly id?: number;
    readonly createAt?: string;
    readonly updateAt?: string | undefined;
    readonly createBy?: Dynamic_User | undefined;
    readonly updateBy?: Dynamic_User | undefined;
    readonly username?: string;
    readonly password?: string;
    readonly phone?: string | undefined;
    readonly email?: string | undefined;
    readonly avatar?: string | undefined;
    readonly status?: Status;
}
