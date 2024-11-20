import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportToPDF = async () => {
  try {
    const originalInvoice = document.querySelector(".invoice");

    if (!originalInvoice) {
      console.error("Invoice element not found");
      return;
    }

    const invoiceClone = originalInvoice.cloneNode(true);

    const buttons = invoiceClone.querySelectorAll(".buttons");
    buttons.forEach((button) => button.remove());

    const inputs = invoiceClone.querySelectorAll("input");
    inputs.forEach((input) => {
      const value = input.value || "";
      const span = document.createElement("span");
      span.textContent = value;
      input.replaceWith(span);
    });

    invoiceClone.style.position = "absolute";
    invoiceClone.style.top = "-10000px";
    document.body.appendChild(invoiceClone);

    const canvas = await html2canvas(invoiceClone, {
      useCORS: true,
      scale: 2,
    });

    document.body.removeChild(invoiceClone);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
