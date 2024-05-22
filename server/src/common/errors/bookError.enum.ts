export enum BookError {
  BOOK_NOT_FOUND = 'Book not found',
  FILE_TOO_LARGE = 'File size too large, max file size is 5MB',
  BODY_CANNOT_BE_EMPTY = "Body can't be empty",
  BOOK_IS_EXISTED = 'Book is already existed',
  BOOK_IS_DELETED = 'Book is already deleted before',
}
