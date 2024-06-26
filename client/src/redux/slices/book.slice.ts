import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BookApis } from '~/apis'
import { Book, FilterBook, FilterBookResponse, Statistic } from '~/types/book'
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
      .addCase(getTopNewest.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTopNewest.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getTopNewest.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getBookById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBookById.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getBookById.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getBookBySlug.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBookBySlug.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getBookBySlug.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(filterBooks.fulfilled, (state, action) => {
        state.isLoading = false
        state.totalPage = action.payload.data?.totalPage as number
        state.totalRecord = action.payload.data?.totalRecord as number
      })
      .addCase(filterBooks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(filterBooks.rejected, (state) => {
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

export const getTopNewest = createAsyncThunk<Response<null>, null, { rejectValue: Response<null> }>(
  'book/newest',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await BookApis.getTopNewest()
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setNewBooks(response.data.data))
        }
      }
      return response.data as Response<null>
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)

export const getRelatedBooks = createAsyncThunk<Response<null>, string, { rejectValue: Response<null> }>(
  'book/getRelatedBooks',
  async (body, { dispatch, rejectWithValue }) => {
    try {
      const response = await BookApis.getRelatedBooks(body)
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setBookList(response.data.data.books))
        }
      }
      return response.data as Response<null>
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)

export const getBookBySlug = createAsyncThunk<Response<Book>, string, { rejectValue: Response<null> }>(
  'book/getBookBySlug',
  async (body, { dispatch, rejectWithValue }) => {
    try {
      const response = await BookApis.getBookBySlug(body)
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setBook(response.data.data.book))
        }
      }
      return response.data as Response<Book>
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)

export const getBookById = createAsyncThunk<Response<Book>, string, { rejectValue: Response<null> }>(
  'book/getBookById',
  async (body, ThunkAPI) => {
    try {
      const response = await BookApis.getBookById(body)
      return response.data as Response<Book>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export const getStatistic = createAsyncThunk<Response<Statistic>, null, { rejectValue: Response<null> }>(
  'book/getStatistic',
  async (_, ThunkAPI) => {
    try {
      const response = await BookApis.getStatistic()
      return response.data as Response<Statistic>
    } catch (error: any) {
      return ThunkAPI.rejectWithValue(error.data as Response<null>)
    }
  }
)

export const filterBooks = createAsyncThunk<Response<FilterBookResponse>, FilterBook, { rejectValue: Response<null> }>(
  'book/filter',
  async (body, { dispatch, rejectWithValue }) => {
    try {
      const response = await BookApis.filterBooks(body)
      if (response) {
        if (response.status >= 200 && response.status <= 299) {
          dispatch(setBookList(response.data.data.books))
        }
      }
      return response.data as Response<FilterBookResponse>
    } catch (error: any) {
      return rejectWithValue(error.data as Response<null>)
    }
  }
)

export default BookSlice
