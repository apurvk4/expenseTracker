import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBContainer,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import PaidPayments from "../Components/PaidPayments";
import ToReceivePayments from "../Components/ToReceivePayments";
import UnPaidPayments from "../Components/UnPaidPayments";
import UpdateBudget from "../Components/UpdateBudget";
import { userActions } from "../Features/userSlice";

const Budget = () => {
  const [dataType, setDataType] = useState({ type: "Paid", active: true });
  const [modal, setModal] = useState(false);
  const [currentMoney, setCurrentMoney] = useState({
    loading: true,
    value: 0,
    isError: false,
    error: "",
    notSet: false,
  });
  const budget = useSelector((state) => {
    if ("budget" in state.user.budget.data) {
      return { budgetSet: true, value: state.user.budget.data.budget };
    }
    return { budgetSet: false, value: 0 };
  });
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const userLoading = useSelector((state) => state.user.loading);
  const stale = useSelector((state) => state.user.budget.stale);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userLoading && !loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, userLoading, navigate]);
  useEffect(() => {
    dispatch(userActions.getBudget());
  }, [budget, stale, dispatch]);
  useEffect(() => {
    getCurrent();
  }, []);
  async function getCurrent() {
    try {
      setCurrentMoney({ ...currentMoney, loading: true });
      let url = import.meta.env.VITE_DEPLOYMENT + "/api/user/budgetRemaining";
      let res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          accept: "application/json",
        },
      });
      if (res.status === 200) {
        res = await res.json();
        setCurrentMoney({
          ...currentMoney,
          loading: false,
          value: res.current,
          isError: false,
          notSet: false,
        });
      } else if (res.status === 403) {
        setCurrentMoney({ ...currentMoney, notSet: true, loading: false });
      } else {
        res = await res.json();
        setCurrentMoney({
          ...currentMoney,
          isError: true,
          loading: false,
          error: res.message ?? "there was an error",
        });
      }
    } catch (err) {
      setCurrentMoney({
        ...currentMoney,
        isError: true,
        error: err.message,
        loading: false,
      });
    }
  }
  function formatMoney(money) {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    }).format(money);
  }
  function displayCurrent() {
    if (currentMoney.loading) {
      return (
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      );
    } else if (currentMoney.notSet) {
      return <b className="text-danger px-2">Not Set</b>;
    } else if (currentMoney.isError) {
      return <b className="text-danger px-2">{currentMoney.error}</b>;
    } else {
      let className = "text-warning px-2";
      if (currentMoney.value <= 10) {
        className = "text-danger px-2";
      }
      return <b className={className}>{formatMoney(currentMoney.value)}</b>;
    }
  }
  return (
    <Layout>
      <MDBContainer style={{ marginTop: "120px" }}>
        <MDBCard>
          <MDBCardHeader>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <b> Total Budget : </b>
                <MDBBtn
                  onClick={() => setModal(!modal)}
                  className="fs-5"
                  color="link"
                >
                  {budget.budgetSet ? formatMoney(budget.value) : "Not Set"}
                </MDBBtn>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <b>Current : </b>
                <span>{displayCurrent()}</span>
              </div>
            </div>
          </MDBCardHeader>
          <MDBCardBody>
            <p>
              <b>Payments</b>
            </p>
            <MDBBtnGroup toolbar style={{ width: "100%" }}>
              <MDBBtn
                onClick={() => {
                  if (dataType.type !== "Paid") {
                    setDataType({ type: "Paid", active: true });
                  } else {
                    setDataType({ type: "Paid", active: !dataType.active });
                  }
                }}
                active={
                  dataType.type === "Paid" && dataType.active ? true : undefined
                }
                color={
                  dataType.type === "Paid" && dataType.active ? "link" : "white"
                }
              >
                Paid
              </MDBBtn>
              <MDBBtn
                active={
                  dataType.type === "To Be Paid" && dataType.active
                    ? true
                    : undefined
                }
                onClick={() => {
                  if (dataType.type !== "To Be Paid") {
                    setDataType({ type: "To Be Paid", active: true });
                  } else {
                    setDataType({
                      type: "To Be Paid",
                      active: !dataType.active,
                    });
                  }
                }}
                color={
                  dataType.type === "To Be Paid" && dataType.active
                    ? "link"
                    : "white"
                }
              >
                To Be Paid
              </MDBBtn>
              <MDBBtn
                active={
                  dataType.type === "To Receive" && dataType.active
                    ? true
                    : undefined
                }
                color={
                  dataType.type === "To Receive" && dataType.active
                    ? "link"
                    : "white"
                }
                onClick={() => {
                  if (dataType.type !== "To Receive") {
                    setDataType({ type: "To Receive", active: true });
                  } else {
                    setDataType({
                      type: "To Receive",
                      active: !dataType.active,
                    });
                  }
                }}
              >
                To Receive
              </MDBBtn>
            </MDBBtnGroup>
            {dataType.type === "Paid" && dataType.active ? (
              <PaidPayments />
            ) : (
              ""
            )}
            {dataType.type === "To Be Paid" && dataType.active ? (
              <UnPaidPayments />
            ) : (
              ""
            )}
            {dataType.type === "To Receive" && dataType.active ? (
              <ToReceivePayments />
            ) : (
              ""
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      {modal ? <UpdateBudget showModal={modal} setShowModal={setModal} /> : ""}
    </Layout>
  );
};

export default Budget;
