export const Type_CONSTANTS = [
    'ROUTER', 
    'BUTTON', 
    'MENU'
] as const;
export type Type = typeof Type_CONSTANTS[number];
