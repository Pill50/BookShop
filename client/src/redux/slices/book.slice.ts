import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BookApis } from '~/apis'
import { Book } from '~/types/book'
import { Feedback } from '~/types/feedback'
import { Response } from '~/types/response'

interface IBook {
  isLoading: boolean
  book: Book
  bookList: Book[]
  topTrendingBooks: Book[]
  newestBooks: Book[]
  feedback: Feedback[]
  totalPage: number
  totalRecord: number
}

const initialState: IBook = {
  isLoading: false,
  book: {} as Book,
  feedback: [] as Feedback[],
  bookList: [] as Book[],
  topTrendingBooks: [] as Book[],
  newestBooks: [] as Book[],
  totalPage: 0,
  totalRecord: 0
}

const BookSlice = createSlice({
  name: 'BookSlice',
  initialState: initialState,
  reducers: {
    setBook: (state, action: PayloadAction<Book>) => {
      state.book = action.payload
    },
    setBookList: (state, action: PayloadAction<Book[]>) => {
      state.bookList = action.payload
    },
    setTopTrendingBooks: (state, action: PayloadAction<Book[]>) => {
      state.topTrendingBooks = action.payload
    },
    setNewBooks: (state, action: PayloadAction<Book[]>) => {
      state.newestBooks = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getTopTrendingBooks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTopTrendingBooks.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getTopTrendingBooks.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const { setBook, setBookList, setNewBooks, setTopTrendingBooks } = BookSlice.actions

export const getTopTrendingBooks = createAsyncThunk<Response<null>, null, { rejectValue: Response<null> }>(
  'book/getTopTrendingBooks',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await BookApis.getTopTrending()
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setTopTrendingBooks(response.data.data))
        }
      }
      return response.data as Response<null>
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)

export default BookSlice
