export const Status_CONSTANTS = [
    'NORMAL', 
    'DISABLE'
] as const;
export type Status = typeof Status_CONSTANTS[number];
