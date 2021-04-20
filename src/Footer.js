import junoLogo from "./images/junoLogo.jpg";

function Footer() {
  return (
    <footer>
      <div className="footerSection wrapper">
        <div>
          <p>I am footer</p>
        </div>
        <div>
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
