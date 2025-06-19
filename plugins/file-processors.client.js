export default defineNuxtPlugin(() => {
  // PDF processing using pdf-parse
  const processPDF = async (file) => {
    const pdfParse = await import('pdf-parse/lib/pdf-parse.js')
    const arrayBuffer = await file.arrayBuffer()
    const data = await pdfParse.default(arrayBuffer)
    return data.text
  }

  // DOCX processing using mammoth
  const processDOCX = async (file) => {
    const mammoth = await import('mammoth')
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  }

  // TXT processing
  const processTXT = async (file) => {
    return await file.text()
  }

  // Main file processor
  const processFile = async (file) => {
    const fileType = file.type.toLowerCase()
    const fileName = file.name.toLowerCase()
    
    try {
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await processPDF(file)
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        return await processDOCX(file)
      } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        return await processTXT(file)
      } else {
        throw new Error('Unsupported file type')
      }
    } catch (error) {
      console.error('File processing error:', error)
      throw new Error(`Failed to process file: ${error.message}`)
    }
  }

  return {
    provide: {
      processFile
    }
  }
})