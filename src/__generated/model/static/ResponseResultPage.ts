export interface ResponseResultPage<T> {
    readonly code: number;
    readonly message: string;
    readonly data: ReadonlyArray<T>;
    readonly total: number;
    readonly totalPage: number;
    readonly page: number;
    readonly size: number;
}
