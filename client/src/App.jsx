import "./App.css";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "./Components/Loading/Loading";
import { useDispatch } from "react-redux";
import { userActions } from "./Features/userSlice";
import { useEffect } from "react";

const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const Budget = lazy(() => import("./Pages/Budget"));
const Logout = lazy(() => import("./Pages/Logout"));
const Error = lazy(() => import("./Pages/Error"));
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userActions.verifytoken());
  }, [dispatch]);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense fallback={<Loading />}>
            <SignUp />
          </Suspense>
        }
      />
      <Route
        path="/logout"
        element={
          <Suspense fallback={<Loading />}>
            <Logout />
          </Suspense>
        }
      />
      <Route
        path="/budget"
        element={
          <Suspense fallback={<Loading />}>
            <Budget />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<Loading />}>
            <Error />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
