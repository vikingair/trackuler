export enum KnownCategory {
    UNKNOWN = 'unknown',
    PAUSE = 'pause',
    END = 'end',
}

type Category = { code: KnownCategory | string; pattern: string; color: string };
export type CategoryWithColor = Pick<Category, 'code' | 'color'>;

const getWithColor = (description: string): CategoryWithColor => {
    const firstWord = description.split(' ')[0].toLowerCase();
    if (firstWord === KnownCategory.PAUSE) return { code: KnownCategory.PAUSE, color: '#165180' };
    if (firstWord === KnownCategory.END) return { code: KnownCategory.END, color: '#165180' };
    else return { code: KnownCategory.UNKNOWN, color: 'none' };
};

export const CategoryService = { getWithColor };
