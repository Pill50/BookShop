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

export function getStatusColorClass(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300';
    case 'SHIPPED':
      return 'bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300';
    case 'CANCELED':
      return 'bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300';
    default:
      return '';
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function eq(a: any, b: any) {
  return a === b;
}
