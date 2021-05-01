import "./App.css";
import "./Footer.css";

function Footer() {
  return (
    <footer>
      <div className="footerSection wrapper wrapperPadding">
        <div className="footerJuno displayFlexRow">
          <p>
            Created by
            <a href="https://www.linkedin.com/in/mmmccormack/" rel="noreferrer">
              Patrick
            </a>
            <a
              href="https://www.linkedin.com/in/hollyjasiura/"
              rel="noreferrer"
            >
              Holly
            </a>
            <a
              href="https://www.linkedin.com/in/mackenzie-howey-a4299a207/"
              rel="noreferrer"
            >
              Mackenzie
            </a>
            <a
              href="https://www.linkedin.com/in/karengonzalez000/"
              rel="noreferrer"
            >
              Karen
            </a>
          </p>
        </div>
        <div className="footerJuno displayFlexRow">
          <p>
            Created at
            <a
              href="http://www.junocollege.com"
              target="_blank"
              rel="noreferrer"
            >
              Juno College
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
