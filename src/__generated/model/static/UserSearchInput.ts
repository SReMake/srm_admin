import type {Status} from '../enums/';

export interface UserSearchInput {
    readonly id?: number | undefined;
    readonly username?: string | undefined;
    readonly phone?: string | undefined;
    readonly status?: Status | undefined;
    readonly createAtStart?: string | undefined;
    readonly updateAtStart?: string | undefined;
    readonly createAtEnd?: string | undefined;
    readonly updateAtEnd?: string | undefined;
}
