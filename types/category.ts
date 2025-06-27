export interface Category {
  id: string
  name: string
  slug?: string | null
  parent_id?: string | null
  created_at?: string | null
}

export interface CreateCategoryDto {
  name: string
  slug?: string
  parent_id?: string
}

export interface UpdateCategoryDto {
  name?: string
  slug?: string
  parent_id?: string
}

export interface CategoryWithChildren extends Category {
  children: Category[]
}

export interface CategoryTree extends Category {
  children: CategoryTree[]
} 