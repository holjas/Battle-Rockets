import junoLogo from "./images/junoLogo.jpeg";
import "./App.css";

function Footer() {
  return (
    <footer>
      <div className="footerSection wrapper">
        <div className="red">
          <p>Coded by 
            <a className="patrick" href="https://www.linkedin.com/in/mmmccormack/"> Patrick</a>
            <a className="holly" href="https://www.linkedin.com/in/hollyjasiura/"> Holly</a>
            <a  className="mackenzie" href="https://www.linkedin.com/in/mackenzie-howey-a4299a207/"> Mackenzie</a>
            <a className="karen" href="https://www.linkedin.com/in/karengonzalez000/"> Karen</a></p>
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