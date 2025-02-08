export const update = async (billData) => {
    try {
      const response = await fetch(`http://localhost:5000/bills/${billData._id}`, {
        method: "PUT",  // PUT method is used to update an existing resource
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Bill updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Error updating bill:", error);
      throw error;
    }
  };
  