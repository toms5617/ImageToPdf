const fs = require('fs-extra'); // File system operations
const { PDFDocument } = require('pdf-lib'); // PDF generation

// Folder containing the images
const imageFolder = 'ImagesToMergeIntoPdf';
// Name of the output PDF file
const pdfFilename = 'output.pdf';

// Function to load images and add them to PDF
async function createPDF() {
    const pdfDoc = await PDFDocument.create();

    const files = await fs.readdir(imageFolder);

    for (const file of files) {
        const filePath = `${imageFolder}/${file}`;
        const ext = file.split('.').pop().toLowerCase();

        // Check the file format
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
            try {
                const imageBytes = await fs.readFile(filePath);

                // Embed the image based on its format
                const img = ext === 'png' 
                    ? await pdfDoc.embedPng(imageBytes) 
                    : await pdfDoc.embedJpg(imageBytes);
                
                const page = pdfDoc.addPage([img.width, img.height]);
                page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

            } catch (error) {
                console.error(`Error processing file ${filePath}: ${error.message}`);
            }
        } else {
            console.log(`Unsupported format: ${file}`);
        }
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(pdfFilename, pdfBytes);
    console.log(`PDF generated: ${pdfFilename}`);
}

// Run the function
createPDF().catch(err => console.log(err));