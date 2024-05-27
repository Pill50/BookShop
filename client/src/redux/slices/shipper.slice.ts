import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ShipperApis } from '~/apis'
import { Response } from '~/types/response'
import { Shipper } from '~/types/shipper'

interface IShipper {
    isLoading: boolean
    shippers: Shipper[]
}

const initialState: IShipper = {
    isLoading: false,
    shippers: [] as Shipper[]
}

const ShipperSlice = createSlice({
    name: 'ShipperSlice',
    initialState: initialState,
    reducers: {
        setShipperList: (state, action: PayloadAction<Shipper[]>) => {
            state.shippers = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getAllShippers.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllShippers.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(getAllShippers.rejected, (state) => {
                state.isLoading = true
            })
    }
})

export const { setShipperList } = ShipperSlice.actions

export const getAllShippers = createAsyncThunk<Response<null>, null, { rejectValue: Response<null> }>(
    'category',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await ShipperApis.getAllShippers()
            if (response) {
                if (response.status >= 200 && response.status <= 299) {
                    dispatch(setShipperList(response.data.data))
                }
            }
            return response.data as Response<null>
        } catch (error: any) {
            return rejectWithValue(error.data as Response<null>)
        }
    }
)

export default ShipperSlice
