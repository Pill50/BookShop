import { User } from './user'

export type Feedback = {
  user: User
  date: string
  rating: number
  content: string
  createdAt: string
}

export type CreateFeedback = {
  userId: string
  bookId: string
  rating: number
  content: string
}
