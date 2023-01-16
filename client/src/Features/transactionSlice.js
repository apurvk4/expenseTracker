import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  list: [],
  loading: false,
  isError: false,
  error: "",
  stale: true,
};
const getTx = createAsyncThunk(
  "transaction/get",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    if (id in state.transaction) {
      if (
        !state.transaction[id].loading &&
        !state.transaction[id].isError &&
        !state.transaction[id].stale
      ) {
        return state.transaction[id].data;
      }
    }
    let url = import.meta.env.VITE_DEPLOYMENT + `/api/txget?tx=${id}`;
    try {
      let res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          accept: "application/json",
        },
      });
      if (res.status === 200) {
        res = await res.json();
        return res;
      }
      res = await res.json();
      return rejectWithValue(res.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const getList = createAsyncThunk(
  "transaction/list",
  async (arg, { getState, rejectWithValue }) => {
    const state = getState();
    if (!state.isError || state.stale) {
      const url = import.meta.env.VITE_DEPLOYMENT + "/api/txlist";
      try {
        let res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            accept: "application/json",
          },
        });
        if (res.status === 200) {
          res = await res.json();
          return res;
        }
        res = await res.json();
        return rejectWithValue(res.message);
      } catch (err) {
        return rejectWithValue(err.message);
      }
    } else {
      return state.list;
    }
  }
);
const transaction = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    listUpdated: (state) => {
      state.stale = true;
    },
    txUpdated: (state, action) => {
      if (action.payload in state) {
        state[action.payload].stale = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTx.pending, (state, action) => {
      let id = action.meta.arg;
      if (!(id in state)) {
        state[id] = {};
        state[id].loading = true;
        state[id].data = {};
        state[id].isError = false;
        state[id].error = "";
        state[id].stale = true;
      } else {
        if (state[id].stale || state[id].isError) {
          state[id].loading = true;
        }
      }
    });
    builder.addCase(getTx.fulfilled, (state, action) => {
      let id = action.meta.arg;
      state[id].loading = false;
      state[id].data = action.payload;
      state[id].isError = false;
      state[id].error = "";
      state[id].stale = false;
    });
    builder.addCase(getTx.rejected, (state, action) => {
      let id = action.meta.arg;
      state[id].loading = false;
      state[id].error = action.payload;
      state[id].isError = true;
      state[id].data = {};
    });
    builder.addCase(getList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getList.fulfilled, (state, action) => {
      state.loading = false;
      state.isError = false;
      state.error = "";
      state.stale = false;
      state.list = action.payload.transactions;
    });
    builder.addCase(getList.rejected, (state, action) => {
      state.loading = false;
      state.isError = true;
      state.error = action.payload;
      state.stale = false;
      state.list = [];
    });
  },
});

const transactionReducers = transaction.reducer;
const transactionActions = { ...transaction.actions };
transactionActions["get"] = getTx;
transactionActions["getList"] = getList;
export default transactionReducers;
export { transactionActions };
