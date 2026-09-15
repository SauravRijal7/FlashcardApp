import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';

// Worker configuration using unpkg CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const dropzoneStyles = {
  border: '2px dashed #007bff',
  borderRadius: '12px',
  padding: '40px',
  textAlign: 'center',
  color: '#555',
  background: '#f8f9fa',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const activeStyle = {
  border: '2px solid #28a745',
  backgroundColor: '#e6ffed',
};

function FileDropzone({ onTextExtracted, onFileNameExtracted }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsing, setParsing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setSelectedFile(file.name);
    setParsing(true);

    if (onFileNameExtracted) {
      onFileNameExtracted(file.name);
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str).join(' ');
          fullText += strings + '\n';
        }

        onTextExtracted(fullText);
      } catch (error) {
        console.error('Error parsing PDF file:', error);
        alert('Could not extract text from this PDF. Please try another file.');
      } finally {
        setParsing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  }, [onTextExtracted, onFileNameExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        ...dropzoneStyles,
        ...(isDragActive ? activeStyle : {}),
      }}
    >
      <input {...getInputProps()} />
      {parsing ? (
        <p>📄 Reading and parsing PDF contents...</p>
      ) : isDragActive ? (
        <p>Drop the PDF file here...</p>
      ) : selectedFile ? (
        <p><strong>Selected PDF:</strong> {selectedFile} (Click or drag to replace)</p>
      ) : (
        <p><strong>Drag & drop a PDF file here</strong>, or click to select a file</p>
      )}
    </div>
  );
}

export default FileDropzone;