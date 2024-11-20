import chroma from 'chroma-js';
export declare function generateColorsMap(color: string): {
    baseColorIndex: number;
    colors: chroma.Color[];
};
export type MantineColorsTuple = readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    ...string[]
];
export declare function generateColors(color: string): MantineColorsTuple;
