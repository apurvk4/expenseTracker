import {
  MDBContainer,
  MDBAccordion,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardTitle,
  MDBBtn,
  MDBCol,
  MDBRow,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import { useEffect } from "react";
import { lazy, Suspense } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ItemLoading from "../Components/ItemLoading";
import Layout from "../Components/Layout/Layout";
import { transactionActions } from "../Features/transactionSlice";
import { userActions } from "../Features/userSlice";
import TransactionItem from "../Components/TransactionItem";
import Loading from "../Components/Loading/Loading";
const Add = lazy(() => import("../Components/AddTransactions/AddTransactions"));
const Remove = lazy(() => import("../Components/RemoveTransactions"));
const Home = () => {
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const toggleAdd = () => setShowAdd(!showAdd);
  const toggleShow = () => setShowDelete(!showDelete);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const stale = useSelector((state) => state.transaction.stale);
  const list = useSelector((state) => state.transaction.list);
  const loading = useSelector((state) => state.transaction.loading);
  const userLoading = useSelector((state) => state.user.loading);
  const [tempList, setTempList] = useState(list);
  const [filters, setFilters] = useState({
    category: { active: false, value: "" },
    date: { active: false, value: "" },
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loggedIn && !userLoading) {
      navigate("/login");
    }
  }, [loggedIn, navigate, userLoading]);
  useEffect(() => {
    dispatch(transactionActions.getList());
  }, [stale, dispatch]);
  useEffect(() => {
    setTempList(DateFilter(CategoryFilter(list)));
  }, [filters, list]);
  function CategoryFilter(arr) {
    if (filters.category.active) {
      return arr.filter((l) => l.category === filters.category.value);
    }
    return arr;
  }
  function DateFilter(arr) {
    if (filters.date.active) {
      let selected = new Date(filters.date.value);
      return arr.filter((l) => new Date(l.createdAt) >= selected);
    }
    return arr;
  }
  return (
    <>
      {userLoading || loading ? (
        <Loading height="100vh" />
      ) : (
        <Layout>
          <MDBContainer style={{ marginTop: "120px" }}>
            <MDBCard>
              <MDBCardHeader>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <MDBBtn
                    color="success"
                    onClick={() => {
                      setShowAdd(true);
                    }}
                  >
                    Add
                  </MDBBtn>
                  <MDBBtn
                    color="danger"
                    onClick={() => {
                      setShowDelete(true);
                    }}
                  >
                    Remove
                  </MDBBtn>
                </div>
                <MDBCardTitle>Filters</MDBCardTitle>
                <MDBRow className="my-2">
                  <MDBCol>
                    <MDBDropdown className="btn-group">
                      <MDBBtn
                        color={
                          filters.category.active ? "primary" : "secondary"
                        }
                        onClick={() => {
                          setFilters({
                            ...filters,
                            category: { active: false, value: "" },
                          });
                        }}
                      >
                        {filters.category.active
                          ? filters.category.value
                          : "Category"}
                      </MDBBtn>
                      <MDBDropdownToggle
                        className={
                          filters.category.active
                            ? "btn-primary"
                            : "btn-secondary"
                        }
                        split
                      ></MDBDropdownToggle>
                      <MDBDropdownMenu>
                        {[...new Set(list.map((val) => val.category))].map(
                          (val, i) => {
                            return (
                              <MDBDropdownItem
                                key={i}
                                data-value={val}
                                link
                                childTag="button"
                                onClick={(e) => {
                                  let v = e.target.parentElement.dataset.value;
                                  setFilters({
                                    ...filters,
                                    category: { active: true, value: v },
                                  });
                                }}
                              >
                                {val}
                              </MDBDropdownItem>
                            );
                          }
                        )}
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBCol>
                  <MDBCol>
                    <MDBRow>Transactions begining from</MDBRow>

                    <input
                      type="date"
                      value={filters.date.value}
                      onChange={(e) => {
                        let d = e.target.value;
                        if (d !== "") {
                          setFilters({
                            ...filters,
                            date: { active: true, value: d },
                          });
                        } else {
                          setFilters({
                            ...filters,
                            date: { active: false, value: "" },
                          });
                        }
                      }}
                    />
                    <button
                      className="custom-btn"
                      onClick={() => {
                        setFilters({
                          ...filters,
                          date: { active: false, value: "" },
                        });
                      }}
                    >
                      clear
                    </button>
                  </MDBCol>
                </MDBRow>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBCardTitle>Transactions</MDBCardTitle>

                <MDBAccordion borderless initialActive={1}>
                  {tempList.map((val, i) => (
                    <TransactionItem key={i} tid={val.for} index={i} />
                  ))}
                </MDBAccordion>
              </MDBCardBody>
            </MDBCard>
          </MDBContainer>
        </Layout>
      )}

      {showDelete ? (
        <Suspense fallback={<ItemLoading />}>
          <Remove
            showModal={showDelete}
            toggleShow={toggleShow}
            setShowModal={setShowDelete}
          />
        </Suspense>
      ) : (
        ""
      )}
      {showAdd ? (
        <Suspense fallback={<ItemLoading />}>
          <Add
            showModal={showAdd}
            toggleShow={toggleAdd}
            setShowModal={setShowAdd}
          />
        </Suspense>
      ) : (
        ""
      )}
    </>
  );
};
export default Home;
