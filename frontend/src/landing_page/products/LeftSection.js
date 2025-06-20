function LeftSection({
  imageURL,
  productName,
  productDesription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6">
          <img src={imageURL} alt={productName} />
        </div>
        <div className="col-6 p-5 mt-5">
          <h1>{productName}</h1>
          <p>{productDesription}</p>
          <div>
            <button className="btn btn-link p-0" style={{ marginRight: "50px", textDecoration: "none", color: "inherit", background: "none", border: "none" }}>
              Try Demo
            </button>
            <button className="btn btn-link p-0" style={{ textDecoration: "none", color: "inherit", background: "none", border: "none" }}>
              Learn More
            </button>
          </div>
          <div className="mt-3">
            <a href={googlePlay}>
              <img src="/images/googlePlayBadge.svg" alt="Google Play Store badge" />
            </a>
            <a href={appStore}>
              <img
                src="/images/appstoreBadge.svg"
                alt="Apple App Store badge"
                style={{ marginLeft: "50px" }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
