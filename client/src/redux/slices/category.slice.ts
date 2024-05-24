import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CategoryApis } from '~/apis'
import { Category } from '~/types/category'
import { Response } from '~/types/response'

interface ICategory {
    isLoading: boolean
    categories: Category[]
}

const initialState: ICategory = {
    isLoading: false,
    categories: [] as Category[]
}

const CategorySlice = createSlice({
    name: 'CategorySlice',
    initialState: initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getAllCategories.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllCategories.fulfilled, (state) => {
                state.isLoading = false
            })
    }
})

export const { setCategory } = CategorySlice.actions

export const getAllCategories = createAsyncThunk<Response<null>, null, { rejectValue: Response<null> }>(
    'category',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await CategoryApis.getAllCategories()
            if (response) {
                if (response.status >= 200 && response.status <= 299) {
                    dispatch(setCategory(response.data.data))
                }
            }
            return response.data as Response<null>
        } catch (error: any) {
            return rejectWithValue(error.data as Response<null>)
        }
    }
)

export default CategorySlice
