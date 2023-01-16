import { MDBContainer, MDBModal, MDBSpinner } from "mdb-react-ui-kit";

const ItemLoading = () => {
  return (
    <MDBModal show={true} staticBackdrop>
      <MDBContainer className="text-center">
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </MDBContainer>
    </MDBModal>
  );
};
export default ItemLoading;
