export const Type_CONSTANTS = [
    'VIEW', 
    'ROUTER', 
    'BUTTON', 
    'MENU'
] as const;
export type Type = typeof Type_CONSTANTS[number];
