import "./App.css";
import "./Navbar.css";
// import star from "./images/star.png";

function Navbar() {
  // const { removeEverything, history } = props;
  return (
    <section className="navbarSection">
      <div className="wrapper">
        {/* <button
          className="starAbortButton"
          onClick={() => {
            removeEverything();
            history.push("/");
            window.location.reload(false);
          }}
        >
          <img src={star} alt="cartoon star" className="starAbort" />
          reset game
        </button> */}
        <h1>Battle Rockets</h1>
      </div>
    </section>
  );
}
export default Navbar;
