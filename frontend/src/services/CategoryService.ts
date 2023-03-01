import { CategoryConfigs } from './Types';

export type Category = { ID: string; name: string; color?: string };

const getWithColor = (categoryConfig: CategoryConfigs, description: string): Category => {
    for (const [ID, { name, regex, color }] of Object.entries(categoryConfig)) {
        if (description.match(new RegExp(regex, 'i'))) {
            return { ID, name, color };
        }
    }
    return { ID: '', name: '' };
};

const isPause = (category: Category) => category.ID === 'pause';
const isEnd = (category: Category) => category.ID === 'end';

export const CategoryService = { getWithColor, isPause, isEnd };
