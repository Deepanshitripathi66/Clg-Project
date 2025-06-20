function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container p-2">
          <a className="navbar-brand" href="/">
            <img
              src="/images/logo.svg"
              style={{ width: "25%" }}
              alt="Logo"
            />
          </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="d-flex" role="navigation">
            <ul className="navbar-nav mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/signup">
                  Signup
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/product">
                  Product
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/pricing">
                  Pricing
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/support">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
