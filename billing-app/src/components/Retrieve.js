import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import './retrieveStyle.css';

const Retrieve = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({ type: '', value: '' });
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('http://localhost:5000/bills');
        const data = await response.json();
        setBills(data);
        setFilteredBills(data); // Initially display all bills
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.name === 'value' && filterCriteria.type === 'seller' 
      ? e.target.value.toUpperCase()
      : e.target.value;

    setFilterCriteria({
      ...filterCriteria,
      [e.target.name]: value,
    });
  };

  const applyFilter = () => {
    let filtered = [...bills];

    if (filterCriteria.type === 'date' && filterCriteria.value) {
      filtered = filtered.filter((bill) => 
        new Date(bill.date).toLocaleDateString("en-GB").includes(filterCriteria.value)
      );
    } else if (filterCriteria.type === 'seller' && filterCriteria.value) {
      filtered = filtered.filter((bill) =>
        bill.seller.toUpperCase().includes(filterCriteria.value)
      );
    }

    setFilteredBills(filtered);
  };

  const viewBill = (bill) => {
    navigate('/create', { state: { bill: bill } }); // Use navigate to redirect
  };

  return (
    <div className="retrieve-bills">
      <h2>Retrieve Bills</h2>

      <div className="filter-section">
        <select 
          name="type" 
          value={filterCriteria.type} 
          onChange={handleFilterChange}
        >
          <option value="">Select Filter</option>
          <option value="date">Date</option>
          <option value="seller">Seller</option>
        </select>

        <input 
          type="text" 
          name="value" 
          placeholder={`Enter ${filterCriteria.type}`} 
          value={filterCriteria.value} 
          onChange={handleFilterChange}
        />

        <button onClick={applyFilter}>Apply Filter</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Date</th>
            <th>Seller</th>
            <th>Net Amount</th>
            <th>View Bill</th>
          </tr>
        </thead>
        <tbody>
          {filteredBills.map((bill) => (
            <tr key={bill._id}>
              <td>{bill.invoiceNumber}</td>
              <td>{new Date(bill.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}</td>
              <td>{bill.seller}</td>
              <td>{Math.round(bill.netAmount)}</td>
              <td><button onClick={() => viewBill(bill)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Retrieve;
