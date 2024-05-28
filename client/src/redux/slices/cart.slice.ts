import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { BookInCart, UpdateBookInCart } from '~/types/book'

interface ICart {
  isLoading: boolean
  cartLength: number
  errorMessage: string
  successMessage: string
}

const initialState: ICart = {
  isLoading: false,
  cartLength: 0,
  errorMessage: '',
  successMessage: ''
}

const CartSlice = createSlice({
  name: 'CartSlice',
  initialState: initialState,
  reducers: {
    setCartLength(state, actions) {
      state.cartLength = actions.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(addBookToCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addBookToCart.fulfilled, (state) => {
        state.isLoading = false
        state.successMessage = 'Add book successfully!'
      })
      .addCase(addBookToCart.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getBookInCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBookInCart.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getBookInCart.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(deleteBookInCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteBookInCart.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(deleteBookInCart.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const { setCartLength } = CartSlice.actions

export const getBookInCart = createAsyncThunk<BookInCart[], null, { rejectValue: null }>(
  'card/getBookInCart',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const items: BookInCart[] = JSON.parse(localStorage.getItem('cartItems') || '[]')
      dispatch(setCartLength(items.length))
      return items as BookInCart[]
    } catch (error: any) {
      return rejectWithValue(null)
    }
  }
)

export const addBookToCart = createAsyncThunk<BookInCart[], BookInCart, { rejectValue: null }>(
  'card/addBookToCart',
  async (body, { dispatch, rejectWithValue }) => {
    try {
      const items: BookInCart[] = JSON.parse(localStorage.getItem('cartItems') || '[]')
      const isExistedItem = items.some((item) => item.bookId === body.bookId)
      if (isExistedItem) {
        items.forEach((item) => {
          if (item.bookId === body.bookId) {
            item.amount += body.amount
          }
        })
      } else {
        items.push(body)
      }
      dispatch(setCartLength(items.length))
      localStorage.setItem('cartItems', JSON.stringify(items))
      return items as BookInCart[]
    } catch (error: any) {
      return rejectWithValue(null)
    }
  }
)

export const updateBookInCart = createAsyncThunk<BookInCart[], UpdateBookInCart, { rejectValue: null }>(
  'card/updateBookInCart',
  async (body, { dispatch, rejectWithValue }) => {
    try {
      const items: BookInCart[] = JSON.parse(localStorage.getItem('cartItems') || '[]')
      const updatedCart = items.map((item) => {
        if (item.bookId === body.bookId) {
          if (body.amount <= 1) item.amount = 1
          else item.amount = body.amount
        }
        return item
      })

      dispatch(setCartLength(updatedCart.length))
      localStorage.setItem('cartItems', JSON.stringify(updatedCart))
      return updatedCart as BookInCart[]
    } catch (error: any) {
      return rejectWithValue(null)
    }
  }
)

export const deleteBookInCart = createAsyncThunk<BookInCart[], string, { rejectValue: null }>(
  'card/deleteBookInCart',
  async (body, { dispatch, rejectWithValue }) => {
    try {
      const items: BookInCart[] = JSON.parse(localStorage.getItem('cartItems') || '[]')
      const newItems = items.filter((item) => item.bookId !== body)
      localStorage.setItem('cartItems', JSON.stringify(newItems))
      dispatch(setCartLength(newItems.length))
      return newItems as BookInCart[]
    } catch (error: any) {
      return rejectWithValue(null)
    }
  }
)

export default CartSlice
