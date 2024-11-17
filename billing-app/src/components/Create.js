import React, { useState } from "react";
import phoneIcon from "../assets/phone.png";
import { jsPDF } from "jspdf";
import "./Style.css";

const Create = () => {
  const [sum, setSum] = useState(0);
  const [items, setItems] = useState([
    { itemName: "", itemNumber: 0, rate: 0, expenses: 0, labour: 0, amount: 0, sum: 0 },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    if (field === "itemName") {
      updatedItems[index][field] = value;
    } else {
      updatedItems[index][field] = parseFloat(value);
    }

    updatedItems[index].amount = updatedItems[index].itemNumber * updatedItems[index].rate;
    const exp1 = updatedItems[index].amount * 0.0625;
    const exp2 = updatedItems[index].itemNumber * 5;
    const exp3 = updatedItems[index].expenses;
    const exp4 = 10;

    updatedItems[index].sum = exp1 + exp2 + exp3 + exp4;
    setItems(updatedItems);

    const newSum = updatedItems.reduce((acc, item) => acc + (isNaN(item.sum) ? 0 : item.sum), 0);
    setSum(newSum);

  };

  const addRow = () => {
    setItems([...items, { itemName: "", itemNumber: 0, rate: 0, amount: 0 }]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.itemNumber, 0);
  const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="invoice">
      <div className="header">
        <div className="companyName">Gulab Chand Rajkumar</div>
        <div className="address">Shed No. 4-5, New Sabji Mandi, Dehradun</div>
        <div className="mobile"><img className="icon" src={phoneIcon} alt="phone icon"></img>9997016707</div>
      </div>

      <div className="invoiceDetails">
        <div className="invoiceNumber">Invoice Number: 123</div>
        <div className="invoiceDate">Invoice Date: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="customerDetails">
        <div>
          Seller : <input placeholder="Enter customer name..." />
        </div>
      </div>

      <div className="invoiceItems">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Number of Items</th>
              <th>Rate</th>
              <th>Amount</th>
              <th colSpan={2}>Expenses</th>
              <th>Net Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={item.itemName}
                    placeholder="Enter item name..."
                    onChange={(e) => handleInputChange(index, "itemName", e.target.value)}
                  />
                </td>
                <td>
                  <input
                  className="numip"
                    type="number"
                    value={item.itemNumber}
                    onChange={(e) => handleInputChange(index, "itemNumber", e.target.value)}
                  />
                </td>
                <td>
                  <input
                  className="numip"
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleInputChange(index, "rate", e.target.value)}
                  />
                </td>
                <td>{item.amount.toFixed(2)}</td>
                {item.expenses !== undefined && item.labour !== undefined && item.sum !== undefined && (
                  <>
                    <td>
                      <div>
                        <p>Others</p>
                        <p>Labour</p>
                        <p>Freight</p>
                        <p>Postage</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p>{(totalAmount * 0.0625).toFixed(2)}</p>
                        <p>{(totalItems * 5).toFixed(2)}</p>
                        <input
                        className="numip"
                          type="number"
                          value={item.expenses}
                          placeholder="Enter freight"
                          onChange={(e) => handleInputChange(index, "expenses", e.target.value)}
                        />
                        <p>10</p>
                      </div>
                    </td>
                    <td>{(totalAmount-sum).toFixed(2)}</td>
                  </>
                )}
              </tr>
            ))}
            <tr className="totals-row">
              <td>Total</td>
              <td>{totalItems}</td>
              <td></td>
              <td>{totalAmount.toFixed(2)}</td>
              <td></td>
              <td>{sum.toFixed(2)}</td>
              <td>{(totalAmount-sum).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
        <div className="summary">Total Net Amount : {(totalAmount-sum).toFixed(2)}</div>
      <div className="add-row">
        <button className="add-row-button" onClick={addRow}>
          Add Entry
        </button>
      </div>
    </div>
  );
};

export default Create;
