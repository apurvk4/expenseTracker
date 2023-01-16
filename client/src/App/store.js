import { configureStore } from "@reduxjs/toolkit";
import transactionReducers from "../Features/transactionSlice";
import { userReducers } from "../Features/userSlice";
const store = configureStore({
  reducer: {
    user: userReducers,
    transaction: transactionReducers,
  },
});
export default store;
