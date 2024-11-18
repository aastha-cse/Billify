// Function to convert a number to words (Indian system)
export const convertToWords = (num) => {
  const units = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const thousands = ["", "Thousand", "Lakh", "Crore"];

  if (num === 0) return "Zero";

  // Separate the integer and fractional part
  const [integerPart] = num.toString().split(".");

  let result = "";
  let i = 0;

  // Convert the integer part into words
  let n = parseInt(integerPart);
  while (n > 0) {
    if (n % 100 < 20) {
      result = units[n % 100] + " " + thousands[i] + " " + result;
      n = Math.floor(n / 100);
    } else {
      result =
        tens[Math.floor((n % 100) / 10)] +
        " " +
        units[n % 10] +
        " " +
        thousands[i] +
        " " +
        result;
      n = Math.floor(n / 100);
    }
    i++;
  }

  // Clean up extra spaces and trim the result
  result = result.trim().replace(/\s{2,}/g, ' ').trim();

  return result + " Only";
};

// import { jsPDF } from "jspdf";