import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const initialState = {
  loading: true,
  data: {},
  isError: false,
  error: {},
  loggedIn: false,
  budget: {
    loading: true,
    data: {},
    isError: false,
    error: "",
    stale: false,
  },
};
const logIn = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    const url = import.meta.env.VITE_DEPLOYMENT + "/api/login";
    try {
      let res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.status === 200) {
        res = await res.json();
        return res;
      } else {
        res = await res.json();
        return rejectWithValue(res);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
const logout = createAsyncThunk(
  "user/logout",
  async (arg, { rejectWithValue }) => {
    const url = import.meta.env.VITE_DEPLOYMENT + "/api/logout";
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
      } else {
        res = await res.json();
        return rejectWithValue(res);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
const verifyToken = createAsyncThunk(
  "user/verify",
  async (arg, { rejectWithValue }) => {
    const url = import.meta.env.VITE_DEPLOYMENT + "/api/verifytoken";
    try {
      let res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          accept: "application/json",
        },
      });
      let val = await res.json();
      if (res.status === 200) {
        return Promise.resolve(val);
      }
      return Promise.reject(val);
    } catch (err) {
      Promise.reject(err);
    }
  }
);
const getBudget = createAsyncThunk(
  "user/getbudget",
  async (arg, { getState, rejectWithValue }) => {
    const state = getState();
    if (
      !state.user.budget.loading &&
      !state.user.budget.stale &&
      !state.user.budget.isError
    ) {
      return state.user.budget.data;
    }
    const url = import.meta.env.VITE_DEPLOYMENT + "/api/user/getbudget";
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
      return rejectWithValue(res);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// const getPaidPayments = createAsyncThunk(
//   "user/getpaid",
//   async (arg, { getState, rejectWithValue }) => {
//     const state = getState();
//     const url = new URL(import.meta.env.VITE_DEPLOYMENT + "/api/user/listpaidtx");
//     const params = new URLSearchParams(url);
//     params.set("limit", state.user.paidPayments.limit);
//     params.set("skip", state.user.paidPayments.skip);
//     console.log(params.toString());
//     try {
//       let res = await fetch(params.toString(), {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           accept: "application/json",
//         },
//       });
//       if (res.status === 200) {
//         res = await res.json();
//         return res;
//       }
//       res = await res.json();
//       return rejectWithValue(res);
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    budgetUpdated: (state) => {
      state.budget.stale = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logIn.pending, (state, action) => {
      state.loading = true;
      state.isError = false;
      state.loggedIn = false;
    });
    builder.addCase(logIn.fulfilled, (state, action) => {
      state.loading = false;
      state.isError = false;
      state.loggedIn = true;
      state.data = action.payload;
      state.error = {};
      alert("login successful");
    });
    builder.addCase(logIn.rejected, (state, action) => {
      state.loading = false;
      state.isError = true;
      state.loggedIn = false;
      state.error = action.payload;
      state.data = {};
    });
    builder.addCase(logout.pending, (state, action) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      state.isError = false;
      state.loggedIn = false;
      state.data = {};
      state.error = {};
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.isError = true;
      state.error = action.payload;
    });
    builder.addCase(verifyToken.pending, (state, action) => {
      state.loading = true;
      state.isError = false;
      state.loggedIn = false;
      state.data = {};
      state.error = {};
    });
    builder.addCase(verifyToken.fulfilled, (state, action) => {
      state.loading = false;
      state.isError = false;
      state.loggedIn = true;
      state.error = {};
      state.data = action.payload;
    });
    builder.addCase(verifyToken.rejected, (state, action) => {
      state.loading = false;
      state.isError = true;
      state.loggedIn = false;
      state.error = action.payload ?? action.error;
      state.data = {};
    });
    builder.addCase(getBudget.pending, (state, action) => {
      if (state.budget.isError || state.budget.stale) {
        state.budget.loading = true;
      }
    });
    builder.addCase(getBudget.fulfilled, (state, action) => {
      state.budget.loading = false;
      state.budget.isError = false;
      state.budget.error = "";
      state.budget.data = action.payload;
    });
    builder.addCase(getBudget.rejected, (state, action) => {
      state.budget.loading = false;
      state.budget.isError = true;
      state.budget.error = action.payload ?? action.error;
      state.budget.data = {};
    });
  },
});

const userActions = { ...userSlice.actions };
userActions["logIn"] = logIn;
userActions["logOut"] = logout;
userActions["verifytoken"] = verifyToken;
userActions["getBudget"] = getBudget;
const userReducers = userSlice.reducer;
export { userActions, userReducers };
