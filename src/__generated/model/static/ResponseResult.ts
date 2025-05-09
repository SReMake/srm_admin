export interface ResponseResult<T> {
    readonly code: number;
    readonly message: string;
    readonly data: T;
}
