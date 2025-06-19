<template>
  <div class="space-y-4">
    <!-- File Drop Zone -->
    <div
      ref="dropZone"
      :class="[
        'file-drop-zone',
        { 'dragover': isDragOver }
      ]"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      @dragleave="handleDragLeave"
    >
      <div class="space-y-4">
        <div class="flex justify-center">
          <DocumentArrowUpIcon class="h-12 w-12 text-gray-400" />
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Upload Document
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Drag and drop your file here, or click to browse
          </p>
        </div>
        
        <div class="flex justify-center">
          <button
            class="btn-primary"
            :disabled="isProcessing"
            @click="triggerFileInput"
          >
            <span v-if="!isProcessing">Choose File</span>
            <span v-else class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"/>
              Processing...
            </span>
          </button>
        </div>
        
        <input
          ref="fileInput"
          type="file"
          accept=".pdf,.docx,.txt"
          class="hidden"
          @change="handleFileSelect"
        >
      </div>
    </div>
    
    <!-- Progress Bar -->
    <div v-if="isProcessing" class="space-y-2">
      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Processing file...</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full progress-bar"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
    
    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
            File Processing Error
          </h3>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Supported Formats -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div class="flex">
        <InformationCircleIcon class="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
            Supported Formats
          </h3>
          <div class="text-sm text-blue-700 dark:text-blue-300 mt-1">
            <ul class="list-disc list-inside space-y-1">
              <li v-for="format in supportedFormats" :key="format.extension">
                <span class="font-mono">{{ format.extension }}</span> - {{ format.description }}
              </li>
            </ul>
            <p class="mt-2 text-xs">Maximum file size: 50MB</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Text Input Alternative -->
    <div class="space-y-4">
      <div class="flex items-center">
        <div class="flex-1 border-t border-gray-300 dark:border-gray-600"/>
        <span class="px-3 text-sm text-gray-500 dark:text-gray-400">Or paste text directly</span>
        <div class="flex-1 border-t border-gray-300 dark:border-gray-600"/>
      </div>
      
      <div>
        <textarea
          v-model="textInput"
          placeholder="Paste your text here to start speed reading..."
          class="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 resize-none"
          @input="handleTextInput"
        />
        
        <div class="flex justify-between items-center mt-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ textInput.split(' ').filter(w => w.length > 0).length }} words
          </span>
          
          <button
            v-if="textInput.trim()"
            class="btn-primary text-sm py-1 px-3"
            @click="loadTextContent"
          >
            Load Text
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  DocumentArrowUpIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['textLoaded'])

const { 
  isProcessing, 
  error, 
  progress, 
  processFile, 
  getSupportedFormats, 
  isFileSupported, 
  validateFileSize 
} = useFileProcessor()

const dropZone = ref(null)
const fileInput = ref(null)
const isDragOver = ref(false)
const textInput = ref('')
const supportedFormats = getSupportedFormats()

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    await processFileUpload(file)
  }
  // Reset input
  event.target.value = ''
}

const handleDrop = async (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(event.dataTransfer.files)
  if (files.length > 0) {
    await processFileUpload(files[0])
  }
}

const handleDragLeave = (event) => {
  // Only remove dragover state if leaving the drop zone entirely
  if (!dropZone.value?.contains(event.relatedTarget)) {
    isDragOver.value = false
  }
}

const processFileUpload = async (file) => {
  try {
    // Validate file
    if (!isFileSupported(file)) {
      throw new Error('Unsupported file format. Please use PDF, DOCX, or TXT files.')
    }
    
    validateFileSize(file)
    
    // Process file
    const text = await processFile(file)
    
    // Emit the extracted text
    emit('textLoaded', text)
    
    // Clear text input if file was loaded
    textInput.value = ''
    
  } catch (err) {
    console.error('File upload error:', err)
  }
}

const handleTextInput = () => {
  // Auto-resize textarea based on content
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
}

const loadTextContent = () => {
  if (textInput.value.trim()) {
    emit('textLoaded', textInput.value.trim())
  }
}

// Handle drag events for the entire drop zone
onMounted(() => {
  const zone = dropZone.value
  if (zone) {
    zone.addEventListener('dragenter', () => {
      isDragOver.value = true
    })
  }
})

// Add this composable or import it
const useFileProcessor = () => {
  const isProcessing = ref(false)
  const error = ref('')
  const progress = ref(0)
  
  const processFile = async (file) => {
    isProcessing.value = true
    error.value = ''
    progress.value = 0
    
    try {
      // Simulate processing
      for (let i = 0; i <= 100; i += 10) {
        progress.value = i
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Read file content
      const text = await readFileContent(file)
      return text
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isProcessing.value = false
      progress.value = 0
    }
  }
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }
  
  const getSupportedFormats = () => [
    { extension: '.pdf', description: 'PDF Documents' },
    { extension: '.docx', description: 'Word Documents' },
    { extension: '.txt', description: 'Text Files' }
  ]
  
  const isFileSupported = (file) => {
    const supportedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    return supportedTypes.includes(file.type) || file.name.endsWith('.txt')
  }
  
  const validateFileSize = (file) => {
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 50MB limit')
    }
  }
  
  return {
    isProcessing,
    error,
    progress,
    processFile,
    getSupportedFormats,
    isFileSupported,
    validateFileSize
  }
}

</script>