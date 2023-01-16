import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBInput,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Loading from "../Components/Loading/Loading";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import { useSelector } from "react-redux";

const Signup = () => {
  const [showModal, setShowModal] = useState(true);
  const toggleShow = () => setShowModal(true);
  const [name, setName] = useState({ data: "", isValid: true, feedback: "" });
  const [email, setEmail] = useState({ data: "", isValid: true, feedback: "" });
  const [password, setPassword] = useState({
    data: "",
    isValid: true,
    feedback: "",
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [userSignup, setUserSignUp] = useState({
    loading: false,
    success: false,
    error: {},
  });
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    setPageLoading(false);
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);
  async function verifyEmail() {
    const val = String(email.data)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    if (!val) {
      return setEmail({ ...email, isValid: false, feedback: "invalid email" });
    }
    try {
      const url =
        import.meta.env.VITE_DEPLOYMENT + "/api/verifyemail/" + email.data;
      let res = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      if (res.status === 200) {
        return setEmail({
          ...email,
          isValid: false,
          feedback: "email is in use. Choose any other email",
        });
      }
      return setEmail({ ...email, isValid: true, feedback: "email is valid" });
    } catch (err) {
      setEmail({ ...email, feedback: err.message, isValid: false });
    }
  }
  function verifyName() {
    if (name.data.length < 5) {
      setName({
        ...name,
        isValid: false,
        feedback: "Name too short",
      });
    } else {
      setName({
        ...name,
        isValid: true,
        feedback: "name is valid",
      });
    }
  }
  function verifyPassword() {
    if (password.data.length < 5) {
      setPassword({
        ...password,
        isValid: false,
        feedback: "password too short",
      });
    } else {
      setPassword({
        ...password,
        isValid: true,
        feedback: "password is valid",
      });
    }
  }
  async function signup() {
    let v = verifyEmail();
    verifyName();
    verifyPassword();
    await v;
    if (email.isValid && name.isValid && password.isValid) {
      const url = import.meta.env.VITE_DEPLOYMENT + "/api/signup";
      setUserSignUp({ ...userSignup, loading: true });
      try {
        let res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name.data,
            email: email.data,
            password: password.data,
          }),
        });
        if (res.status === 201) {
          setUserSignUp({
            ...userSignup,
            loading: false,
            success: true,
            error: {},
          });
          alert("sign up successful");
          navigate("/login");
          return;
        }
        res = await res.json();
        setUserSignUp({
          ...userSignup,
          loading: false,
          success: false,
          error: res,
        });
        return alert(res.message);
      } catch (err) {
        setUserSignUp({
          ...userSignup,
          loading: false,
          success: false,
          error: err,
        });
        return alert(err.message);
      }
    }
  }
  return (
    <>
      {pageLoading ? (
        <Loading />
      ) : (
        <Layout>
          <MDBModal show={showModal} setShow={toggleShow} staticBackdrop>
            <MDBModalDialog centered>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>Sign up</MDBModalTitle>
                </MDBModalHeader>
                <MDBModalBody>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      signup();
                    }}
                  >
                    <div className="mb-2">
                      <MDBInput
                        className="mb-4"
                        type="text"
                        id="form2Example0"
                        label="Full name"
                        onInput={(e) => {
                          setName({ ...name, data: e.target.value });
                        }}
                        value={name.data}
                        onBlur={verifyName}
                      />
                      {!name.isValid ? (
                        <span style={{ color: "red" }}>{name.feedback}</span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      <MDBInput
                        className="mb-4"
                        type="email"
                        id="form2Example1"
                        label="Email address"
                        value={email.data}
                        onInput={(e) => {
                          setEmail({ ...email, data: e.target.value });
                        }}
                        onBlur={async () => {
                          await verifyEmail();
                        }}
                      />
                      {!email.isValid ? (
                        <span style={{ color: "red" }}>{email.feedback}</span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      <MDBInput
                        className="mb-4"
                        type="password"
                        id="form2Example2"
                        label="Password"
                        value={password.data}
                        onInput={(e) => {
                          setPassword({ ...password, data: e.target.value });
                        }}
                        onBlur={verifyPassword}
                      />
                      {!password.isValid ? (
                        <span style={{ color: "red" }}>
                          {password.feedback}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <MDBBtn
                      type="submit"
                      className="mb-4"
                      block
                      disabled={
                        !name.isValid || !email.isValid || !password.isValid
                      }
                    >
                      {userSignup.loading ? (
                        <>
                          <MDBSpinner size="sm" role="status" tag="span" />
                          <span className="visually-hidden">signing Up...</span>
                        </>
                      ) : (
                        ""
                      )}
                      Sign Up
                    </MDBBtn>

                    <div className="text-center">
                      <p>
                        Already a member? <Link to="/login">Sign in</Link>
                      </p>
                    </div>
                  </form>
                </MDBModalBody>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </Layout>
      )}
    </>
  );
};
export default Signup;
