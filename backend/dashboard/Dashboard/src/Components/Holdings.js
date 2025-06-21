import React, { useEffect, useState } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import "./Holding.css"; // If you create a CSS file
import "./Responsive.css";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || "";
    axios.get(`${backendBaseUrl}/allHoldings`)
      .then((res) => setAllHoldings(res.data))
      .catch((err) => console.error("Error fetching holdings:", err));
  }, []);

  const totalInvestment = allHoldings.reduce((acc, stock) => acc + stock.avg * stock.qty, 0);
  const currentValue = allHoldings.reduce((acc, stock) => acc + stock.price * stock.qty, 0);
  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment ? ((pnl / totalInvestment) * 100).toFixed(2) : "0.00";

  const labels = allHoldings.map((stock) => stock.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Name",
        data: allHoldings.map((stock) => stock.price * stock.qty),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Top Summary */}
      <div className="row" style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px" }}>
        <div className="col">
          <h5>{totalInvestment.toFixed(2)}</h5>
          <p>Total Investment</p>
        </div>
        <div className="col">
          <h5>{currentValue.toFixed(2)}</h5>
          <p>Current Value</p>
        </div>
        <div className="col">
          <h5 style={{ color: pnl >= 0 ? "green" : "red" }}>
            {pnl.toFixed(2)} ({pnlPercent}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      {/* Holdings Table */}
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty</th>
              <th>Avg. Cost</th>
              <th>LTP</th>
              <th>Cur. Value</th>
              <th>P&L</th>
              <th>Net Chg</th>
              <th>Day Chg</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const profit = curValue - stock.avg * stock.qty;
              const isProfit = profit >= 0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.price < stock.avg ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{profit.toFixed(2)}</td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div style={{ marginTop: "40px" }}>
        <VerticalGraph data={data} />
      </div>
    </div>
  );
};

export default Holdings;
