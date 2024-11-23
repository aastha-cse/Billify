import React, { useState, useEffect } from "react";
import phoneIcon from "../assets/phone.png";
import { convertToWords } from "./toWords";
import { exportToPDF } from "./exportPDF";
import { save } from "./saveBill";
import "./Style.css";

const Create = () => {
  const [sum, setSum] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [items, setItems] = useState([
    { itemName: "", itemNumber: "", rate: "", amount: 0 },
  ]);
  const [saveStatus, setSaveStatus] = useState({ message: "", success: false });
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "itemName" || field === "remark"
        ? value.toUpperCase()
        : value === ""
        ? ""
        : parseFloat(value);

    if (field === "itemNumber" || field === "rate") {
      updatedItems[index].amount =
        updatedItems[index].itemNumber * updatedItems[index].rate;
    }

    setItems(updatedItems);
    recalculateSum(updatedItems, expenses);
  };

  const handleExpensesChange = (value) => {
    const newExpenses = parseFloat(value) || 0;
    setExpenses(newExpenses);
    recalculateSum(items, newExpenses);
  };

  const recalculateSum = (updatedItems, currentExpenses) => {
    const totalAmount = updatedItems.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    const totalItems = updatedItems.reduce(
      (acc, item) => acc + item.itemNumber,
      0
    );
    const newSum = totalAmount * 0.0625 + totalItems * 5 + currentExpenses + 10;
    setSum(newSum);
  };

  const addRow = () => {
    const newItems = [
      ...items,
      { itemName: "", itemNumber: "", rate: "", amount: 0 },
    ];
    setItems(newItems);
    recalculateSum(newItems, expenses);
  };

  const downloadPDF = () => {
    exportToPDF(".invoice", "invoice.pdf");
  };

  useEffect(() => {
    const fetchLatestInvoiceNumber = async () => {
      try {
        const response = await fetch("http://localhost:5000/bills/latest-invoice");
        const data = await response.json();
        setInvoiceNumber(data.invoiceNumber);
      } catch (error) {
        console.error("Error fetching the latest invoice number:", error);
      }
    };

    fetchLatestInvoiceNumber();
  }, []);

  const saveBill = () => {
    const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);
    const netAmount = totalAmount - sum;

    const billData = {
      invoiceNumber,
      date: new Date(),
      seller: document.querySelector("input[placeholder='Enter seller name']")
        .value,
      items,
      totalAmount,
      sum,
      netAmount,
    };

    save(billData)
      .then((response) => {
        setSaveStatus({ message: "Bill saved successfully!", success: true });
        setInvoiceNumber(response.savedBill.invoiceNumber);
      })
      .catch((error) => {
        setSaveStatus({ message: "Failed to save the bill.", success: false });
      });
  };

  const totalItems = items.reduce((acc, item) => acc + item.itemNumber, 0);
  const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);

  const netAmount = totalAmount - sum;
  const netAmountInWords = convertToWords(netAmount);

  const handleKeyDown = (e, index, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = getNextInput(index, field);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const getNextInput = (index, field) => {
    const nextIndex = index + 1;
    if (field === "itemName") {
      return document.getElementById(`itemNumber-${index}`);
    }
    if (field === "itemNumber") {
      return document.getElementById(`rate-${index}`);
    }
    if (field === "rate") {
      return nextIndex < items.length
        ? document.getElementById(`itemName-${nextIndex}`)
        : null;
    }
    return null;
  };

  return (
    <div className="invoice">
      <div className="header">
        <div className="companyName">Gulab Chand Rajkumar</div>
        <div className="address">Shed No. 4-5, New Sabji Mandi, Dehradun</div>
        <div className="mobile">
          <img className="icon" src={phoneIcon} alt="phone icon" />
          9997016707
        </div>
      </div>

      <div className="invoiceDetails">
        <div className="invoiceNumber">Invoice Number: {invoiceNumber}</div>
        <div className="invoiceDate">
          Invoice Date:{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="sellerDetails">
        <div>
          Seller:{" "}
          <input
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
            placeholder="Enter seller name"
          />
        </div>
      </div>

      <div className="invoiceItems">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Number of Items</th>
              <th>Rate</th>
              <th>Remark</th>
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
                    id={`itemName-${index}`}
                    type="text"
                    value={item.itemName}
                    placeholder="Enter item name"
                    onChange={(e) =>
                      handleInputChange(index, "itemName", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index, "itemName")}
                  />
                </td>
                <td>
                  <input
                    id={`itemNumber-${index}`}
                    className="numip"
                    type="number"
                    value={item.itemNumber}
                    placeholder="Enter number"
                    onChange={(e) =>
                      handleInputChange(index, "itemNumber", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index, "itemNumber")}
                  />
                </td>
                <td>
                  <input
                    id={`rate-${index}`}
                    className="numip"
                    type="number"
                    value={item.rate}
                    placeholder="Enter rate"
                    onChange={(e) =>
                      handleInputChange(index, "rate", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index, "rate")}
                  />
                </td>
                <td>
                  <input
                    id={`remark-${index}`}
                    type="text"
                    value={item.remark}
                    placeholder="Enter remark"
                    onChange={(e) =>
                      handleInputChange(index, "remark", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index, "remark")}
                  />
                </td>
                <td>{Math.round(item.amount)}</td>
                {index === 0 && (
                  <>
                    <td>
                      <div>
                        <p>Labour</p>
                        <p>Freight</p>
                        <p>Postage</p>
                        <p>Others</p>
                      </div>
                    </td>
                    <td>
                      <div className="values">
                        <p>{Math.round(totalItems * 5)}</p>
                        <input
                          className="numip"
                          type="number"
                          value={expenses || ""}
                          placeholder="Enter freight"
                          onChange={(e) => handleExpensesChange(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index, "expenses")}
                        />
                        <p>10</p>
                        <p>{Math.round(totalAmount * 0.0625)}</p>
                      </div>
                    </td>
                    <td>{Math.round(totalAmount - sum)}</td>
                  </>
                )}
              </tr>
            ))}
            <tr className="totals-row">
              <td>Total</td>
              <td>{totalItems}</td>
              <td></td>
              <td></td>
              <td>{Math.round(totalAmount)}</td>
              <td></td>
              <td>{Math.round(sum)}</td>
              <td>{Math.round(totalAmount - sum)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="summary">Total Net Amount: {netAmountInWords}</div>

      <div className="buttons">
        <button className="add-row-button" onClick={addRow}>
          Add Entry
        </button>
        <button className="download-pdf-button" onClick={downloadPDF}>
          Download PDF
        </button>
        <button className="save-bill-button" onClick={saveBill}>
          Save Bill
        </button>
      </div>
      <div
        className="save-status"
        style={{
          color: saveStatus.success ? "green" : "red",
        }}
      >
        {saveStatus.message && <p>{saveStatus.message}</p>}
      </div>
    </div>
  );
};

export default Create;
