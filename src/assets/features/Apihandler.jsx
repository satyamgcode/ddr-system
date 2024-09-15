import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const createfarmer = createAsyncThunk(
    "createfarmer",
    async (data, { rejectWithValue }) => {
        try {
            const response = await fetch('https://66e510565cc7f9b6273c2ff3.mockapi.io/farmers', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error.message || "Failed to create farmer");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            // Ensure the error is serializable
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);


export const showfarmer = createAsyncThunk(
    "farmer",
    async (args, { rejectWithValue }) => {
        try {
            const response = await fetch('https://66e5172c5cc7f9b6273c4160.mockapi.io/getfarmer');

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error.message || "Failed to fetch farmers");
            }

            const result = await response.json();
            return result;
        } catch (error) {

            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);



export const farmerdetails = createSlice({
    name: "farmerdetails",
    initialState: {
        farmer: [],
        loading: false,
        error: null,
        searchedfarmer: [],
    },
    reducers: {
        searchfarmer: (state, action) => {
            state.searchedfarmer = state.farmer.filter((ele) => ele.farmercode === parseInt(action.payload))
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(showfarmer.pending, (state) => {
                state.loading = true;
            })
            .addCase(showfarmer.fulfilled, (state, action) => {
                state.loading = false;
                state.farmer = action.payload;
            })
            .addCase(showfarmer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createfarmer.pending, (state) => {
                state.loading = true;
            })
            .addCase(createfarmer.fulfilled, (state, action) => {
                state.loading = false;
                state.farmer.push(action.payload);
            })
            .addCase(createfarmer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default farmerdetails.reducer;
export const {searchfarmer} = farmerdetails.actions;
