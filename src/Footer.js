import junoLogo from "./images/junoLogo.jpg";

function Footer() {
  return (
    <footer>
      <div className="footerSection wrapper">
        <div>
          <p className="redText">
            Coded by
            <a
              className="yellowText"
              href="https://www.linkedin.com/in/mmmccormack/"
              rel="noreferrer"
            >
              Patrick
            </a>
            <a
              className="redText"
              href="https://www.linkedin.com/in/hollyjasiura/"
              rel="noreferrer"
            >
              Holly
            </a>
            <a
              className="yellowText"
              href="https://www.linkedin.com/in/mackenzie-howey-a4299a207/"
              rel="noreferrer"
            >
              Mackenzie
            </a>
            <a
              className="redText"
              href="https://www.linkedin.com/in/karengonzalez000/"
              rel="noreferrer"
            >
              Karen
            </a>
          </p>
        </div>
        <div>
          <p>Created at Juno College</p>
          <a href="http://www.junocollege.com" target="_blank" rel="noreferrer">
            <img src={junoLogo} alt="Juno College of Technology Company Logo" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
