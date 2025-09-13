export class CategoryModel {
    constructor(
        public id: number,
        public categoryName: string,
        public parentCategoryId: number | null = null,
        public parentCategory: CategoryModel | null = null,
        public subCategories: CategoryModel[] = []
    ) {}
}
