import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBListGroup,
  MDBListGroupItem,
  MDBModalFooter,
  MDBCheckbox,
} from "mdb-react-ui-kit";
const MarkPaid = ({
  showModal,
  setShowModal,
  friends,
  tid,
  Total,
  listUpdated,
}) => {
  function toggleShow() {
    setShowModal(!showModal);
  }
  function formatMoney(money) {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    }).format(money);
  }
  function showList() {
    let NotPaid = friends?.filter((friend) => !friend.paid);
    let l = friends?.length;
    let perPerson = Total / l;
    return NotPaid.map((friend, i) => {
      return (
        <MDBListGroupItem key={i}>
          <MDBCheckbox id={`paidcheck${i}`} data-email={friend.email} />
          {friend.name} : <b> {formatMoney(perPerson)}</b>
        </MDBListGroupItem>
      );
    });
  }
  async function update() {
    let NotPaid = friends?.filter((friend) => !friend.paid);
    const mails = [];
    for (let i = 0; i < NotPaid.length; i++) {
      let d = document.getElementById(`paidcheck${i}`);
      if (d.checked) {
        mails.push(d.dataset.email);
      }
    }
    if (mails.length === 0) {
      alert("end");
      return;
    }
    let url = import.meta.env.VITE_DEPLOYMENT + `/api/txpaid?tid=${tid}`;
    let res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(mails),
    });
    if (res.status === 200) {
      alert("updated successfully");
      if (typeof listUpdated === "function") {
        listUpdated();
      }
    } else {
      res = await res.json();
      alert(res.message);
    }
  }
  return (
    <MDBModal show={showModal} setShow={setShowModal} staticBackdrop>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Mark As Paid</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={toggleShow}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBListGroup style={{ minWidth: "22rem" }} light>
              {showList()}
            </MDBListGroup>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toggleShow}>
              Close
            </MDBBtn>
            <MDBBtn onClick={() => update()}>Save changes</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};
export default MarkPaid;
