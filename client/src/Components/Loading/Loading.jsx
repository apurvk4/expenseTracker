import "./Loading.css";
const Loading = (height) => {
  return (
    <div
      className={
        height
          ? "container w-100 d-flex justify-content-center align-items-center"
          : "container h-100 w-100 d-flex justify-content-center align-items-center"
      }
      style={height ? { border: 0, height: height } : { border: 0 }}
    >
      <section className="loading-section">
        <span className="loader-19"></span>
      </section>
    </div>
  );
};
export default Loading;
