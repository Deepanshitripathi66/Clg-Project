function Education() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6">
          <img src="/images/education.svg" alt="Education" style={{ width: "70%" }} />
        </div>
        <div className="col-6">
          <h1 className="mb-3 fs-2">Free and open market education</h1>
          <p>
            Varsity, the largest online stock market education book in the world
            covering everything from the basics to advanced trading.
          </p>
          <button className="btn btn-link p-0" style={{ textDecoration: "none", color: "inherit", background: "none", border: "none" }}>
            Varsity <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </button>
          <p className="mt-5">
            TradingQ&A, the most active trading and investment community in
            India for all your market related queries.
          </p>
          <button className="btn btn-link p-0" style={{ textDecoration: "none", color: "inherit", background: "none", border: "none" }}>
            TradingQ&A <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Education;
