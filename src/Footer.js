import junoLogo from "./images/junoLogo.jpg";
import "./Navbar.css";

function Footer() {
  return (
    <footer>
      <div className="footerSection wrapper">
        <div className="red">
          <p>
            Coded by <span className="patrick">Patrick</span>
            <span className="holly">Holly</span>
            <span className="mackenzie">Mackenzie</span>
            <span className="karen">Karen</span>
          </p>
        </div>
        <div className="red">
          <p>Created at Juno College</p>
          <a href="http://www.junocollege.com" target="_blank">
            <img src={junoLogo} alt="Juno College of Technology Company Logo" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
