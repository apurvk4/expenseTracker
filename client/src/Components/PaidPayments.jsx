import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Loading from "./Loading/Loading";
import PaymentDetails from "./PaymentDetails";
const PaidPayments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ isError: false, error: "" });
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const stale = useSelector((state) => state.transaction.stale);
  const [showModal, setShowModal] = useState(false);
  const [tid, setTid] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  useEffect(() => {
    getData();
  }, [stale, skip, limit]);
  async function getData() {
    setLoading(true);
    const url = new URL(
      import.meta.env.VITE_DEPLOYMENT + "/api/user/listpaidtx"
    );
    url.searchParams.set("skip", skip);
    url.searchParams.set("limit", limit);
    let res = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: {
        accept: "application/json",
      },
    });
    if (res.status === 200) {
      res = await res.json();
      setLoading(false);
      setError({ ...error, isError: false });
      setData(res);
      if (res.length === 0) {
        setLastPage(true);
      }
    } else {
      setLoading(false);
      res = await res.json();
      setError({ isError: true, error: res.message ?? "there was an error" });
    }
  }
  function formatMoney(money) {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    }).format(money);
  }
  function display() {
    if (loading) {
      return <Loading />;
    } else if (error.isError) {
      return (
        <div
          className="container h-100 w-100 d-flex justify-content-center align-items-center"
          style={{ border: 0 }}
        >
          <section className="loading-section">
            <span style={{ color: "red" }}>{error.error}</span>
          </section>
        </div>
      );
    } else {
      return (
        <MDBTable responsive>
          <MDBTableHead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Amount</th>
              <th scope="col">Payer</th>
              <th scope="col">Details</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {data.map((row, i) => {
              return (
                <tr key={i}>
                  <th scope="row">{row.transactions.category}</th>
                  <td>
                    <b className="fw-bold text-danger">
                      {"-" + formatMoney(row.transactions.amount)}
                    </b>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      <span>{row.transactions.payer.email}</span>
                      <span>{row.transactions.payer.name}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="custom-btn"
                      data-id={row.transactions.for}
                      onClick={(e) => {
                        let id = e.target.dataset.id;
                        setShowModal(!showModal);
                        setTid(id);
                      }}
                    >
                      Get More Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </MDBTableBody>
          <tfoot>
            <tr>
              <button
                disabled={page <= 1 ? true : false}
                className="custom-btn"
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1);
                    setLastPage(false);
                    setSkip(skip - limit);
                  }
                }}
              >
                previous{" "}
              </button>
              <button className="custom-btn">{page}</button>
              <button
                className="custom-btn"
                disabled={lastPage}
                onClick={() => {
                  setSkip(skip + limit);
                  setPage(page + 1);
                }}
              >
                Next{" "}
              </button>
            </tr>
          </tfoot>
        </MDBTable>
      );
    }
  }
  return (
    <>
      {display()}
      {showModal ? (
        <PaymentDetails
          tid={tid}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      ) : (
        ""
      )}
    </>
  );
};
export default PaidPayments;
