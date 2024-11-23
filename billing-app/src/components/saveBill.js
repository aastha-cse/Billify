export const save = async (billData) => {
    try {
      const response = await fetch("http://localhost:5000/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Bill saved successfully:", result);
      return result;
    } catch (error) {
      console.error("Error saving bill:", error);
      throw error;
    }
  };
  