export const generateUniqueSlug = (slug: string): string => {
  const sanitizedSlug = slug.replace(/\s+/g, '-');
  const uniqueString = `${Date.now()}${Math.random().toFixed(3).split('.')[1]}`;
  return `${sanitizedSlug}-${uniqueString}`;
};

export function isCategorySelected(
  categoryId: string,
  bookCategories: any[],
): boolean {
  return bookCategories.some((category) => category.id === categoryId);
}
