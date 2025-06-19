export const useFileProcessor = () => {
  const isProcessing = ref(false)
  const error = ref(null)
  const progress = ref(0)
  
  const { $processFile } = useNuxtApp()
  
  const processFile = async (file) => {
    isProcessing.value = true
    error.value = null
    progress.value = 0
    
    try {
      // Simulate progress for user feedback
      const progressInterval = setInterval(() => {
        if (progress.value < 90) {
          progress.value += 10
        }
      }, 100)
      
      const text = await $processFile(file)
      
      clearInterval(progressInterval)
      progress.value = 100
      
      // Validate extracted text
      if (!text || text.trim().length === 0) {
        throw new Error('No text content found in the file')
      }
      
      // Clean up the text
      const cleanText = text
        .replace(/\s+/g, ' ')
        .replace(/[\r\n\t]+/g, ' ')
        .trim()
      
      if (cleanText.length < 10) {
        throw new Error('File contains insufficient text content')
      }
      
      return cleanText
      
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isProcessing.value = false
      // Reset progress after a delay
      setTimeout(() => {
        progress.value = 0
      }, 2000)
    }
  }
  
  const getSupportedFormats = () => {
    return [
      {
        extension: '.pdf',
        mimeType: 'application/pdf',
        description: 'PDF Documents'
      },
      {
        extension: '.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        description: 'Word Documents'
      },
      {
        extension: '.txt',
        mimeType: 'text/plain',
        description: 'Text Files'
      }
    ]
  }
  
  const isFileSupported = (file) => {
    const supportedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    const supportedExtensions = ['.pdf', '.docx', '.txt']
    const fileName = file.name.toLowerCase()
    
    return supportedTypes.includes(file.type.toLowerCase()) || 
           supportedExtensions.some(ext => fileName.endsWith(ext))
  }
  
  const getFileInfo = (file) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
    const type = file.type || 'Unknown'
    
    return {
      name: file.name,
      size: `${sizeInMB} MB`,
      type,
      lastModified: new Date(file.lastModified).toLocaleDateString()
    }
  }
  
  const validateFileSize = (file, maxSizeMB = 50) => {
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      throw new Error(`File size (${fileSizeMB.toFixed(1)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`)
    }
    return true
  }
  
  return {
    isProcessing: readonly(isProcessing),
    error: readonly(error),
    progress: readonly(progress),
    processFile,
    getSupportedFormats,
    isFileSupported,
    getFileInfo,
    validateFileSize
  }
}