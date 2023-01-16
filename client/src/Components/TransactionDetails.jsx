import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { useState } from "react";
import { useSelector } from "react-redux";
import MarkPaid from "./MarkPaid";

const TransactionDetails = ({ data, listUpdated }) => {
  const { email } = useSelector((state) => state.user.data?.user);
  const [showModal, setShowModal] = useState(false);
  function getTime(dateString) {
    let current = new Date();
    let then = new Date(dateString);
    let diff = current - then;
    let sec = diff / 1000;
    if (sec <= 59) {
      sec = Math.round(sec);
      if (sec < 10) {
        return "Just Now";
      }
      return sec + "s";
    }
    let min = sec / 60;
    if (min < 60) {
      min = Math.round(min);
      return min + "m";
    }
    let hrs = min / 60;
    if (hrs < 24) {
      hrs = Math.round(hrs);
      return hrs + "h";
    }
    if (current.getFullYear() === then.getFullYear()) {
      let d = then.toLocaleDateString("default", {
        month: "short",
      });
      return then.getDate() + " " + d;
    }
    let d = then.toLocaleDateString("default", {
      month: "short",
      year: "2-digit",
    });
    return d;
  }
  function formatMoney(money) {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    }).format(money);
  }
  function amount() {
    if (data.payer?.email === email) {
      let l = data.friends.length;
      let perPerson = data.amount / l;
      let p = data.friends.filter((friend) => friend.paid).length;
      l = data.amount - p * perPerson;
      return formatMoney(l);
    } else {
      let l = data.friends.length;
      l = data.amount / l;
      return formatMoney(l);
    }
  }
  function NumOfPeople() {
    return data.friends.filter((friend) => !friend.paid).length;
  }
  function MoneyPaid() {
    let message = "You owe";
    let ind = data.friends.findIndex((val) => val.email === email);
    if (ind !== -1) {
      if (data.friends[ind].paid) {
        message = "You Paid";
      }
    }
    return message;
  }
  function AddAmount() {
    if (data.payer?.email === email) {
      let l = data.friends.length;
      let perPerson = data.amount / l;
      let p = data.friends.filter((friend) => friend.paid).length;
      l = data.amount - p * perPerson;
      let payment = { amount: l, message: "To be received", color: "warning" };
      if (l <= 0) {
        payment = { ...payment, message: "All Received", color: "success" };
      }
      return (
        <div className="d-flex align-items-center">
          <div>
            <p>{formatMoney(payment.amount)}</p>
            <MDBBadge color={payment.color} pill>
              {payment.message}
            </MDBBadge>
          </div>
        </div>
      );
    } else {
      let l = data.friends.length;
      let ind = data.friends.findIndex((val) => val.email === email);
      let payment = { message: "To be paid", color: "danger" };
      if (ind !== -1) {
        if (data.friends[ind].paid) {
          payment = { message: "Paid", color: "success" };
        }
      }
      l = data.amount / l;
      return (
        <div className="d-flex align-items-center">
          <div>
            <p>{formatMoney(l)}</p>
            <MDBBadge color={payment.color} pill>
              {payment.message}
            </MDBBadge>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <MDBTable align="middle" responsive>
        <MDBTableHead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Amount</th>
            <th scope="col">Date</th>
            <th scope="col">payer</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          <tr>
            <td>{data.name}</td>
            <td>
              <p className="fw-normal">{data.category}</p>
            </td>
            <td>{AddAmount()}</td>
            <td>{getTime(data.date)}</td>
            <td>
              <div className="d-flex align-items-center">
                <div>
                  <p className="fw-bold mb-1">{data.payer.name}</p>
                  <p className="text-muted mb-0">{data.payer.email}</p>
                </div>
              </div>
            </td>
          </tr>
        </MDBTableBody>
      </MDBTable>
      {data.payer?.email !== email ? (
        <span>
          {MoneyPaid()} {data.payer?.name} <b>{amount()}</b>
        </span>
      ) : (
        <span className="mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(!showModal);
            }}
            disabled={NumOfPeople() > 0 ? false : true}
            className="custom-btn"
          >
            {NumOfPeople()} People
          </button>
          Owe you Total of <b> {amount()}</b>
        </span>
      )}
      {showModal ? (
        <MarkPaid
          showModal={showModal}
          friends={data.friends}
          Total={data.amount}
          setShowModal={setShowModal}
          tid={data._id}
          listUpdated={listUpdated}
        />
      ) : (
        ""
      )}
    </>
  );
};
export default TransactionDetails;
