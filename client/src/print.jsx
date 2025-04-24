"use client"

// Add this component to your project and import it in your main layout or App component
function PrintStyles() {
  return (
    <style jsx global>{`
      @media print {
        @page {
          size: auto;
          margin: 10mm;
        }
        
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          background-color: white !important;
        }
        
        .print-hide {
          display: none !important;
        }
        
        /* Ensure images print properly */
        img {
          max-width: 100% !important;
          page-break-inside: avoid;
        }
        
        /* Ensure proper page breaks */
        h1, h2, h3 {
          page-break-after: avoid;
        }
        
        /* Remove shadows and borders for cleaner print */
        .shadow-lg, .border {
          box-shadow: none !important;
          border-color: #ddd !important;
        }
      }
    `}</style>
  )
}

export default PrintStyles
