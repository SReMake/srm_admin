export interface JobInput {
    readonly className: string;
    readonly methodName: string;
    readonly name: string;
    readonly cron: string;
    readonly startTime?: string | undefined;
    readonly endTime?: string | undefined;
}
