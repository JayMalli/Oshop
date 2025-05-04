import { BackendCategoryType } from '../types/BackendTypes';

export const CategorytMapper = (CategoryRes: BackendCategoryType) => {
  return {
    id: CategoryRes.categoryId,
    name: CategoryRes.categoryName,
  };
};
