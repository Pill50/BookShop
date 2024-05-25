import { User } from './user'

export type Feedback = {
  user: User
  date: string
  rating: number
  content: string
}
