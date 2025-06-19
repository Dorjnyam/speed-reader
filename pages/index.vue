<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpenIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Speed Reader</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Read faster, comprehend better</p>
            </div>
          </div>
          
          <!-- Theme Toggle -->
          <button
            class="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleDarkMode"
          >
            <SunIcon v-if="isDark" class="w-5 h-5 text-yellow-500" />
            <MoonIcon v-else class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <!-- Welcome Section (shown when no text) -->
      <div v-if="!currentText" class="text-center space-y-8 mb-12">
        <div class="space-y-4">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Read at <span class="text-blue-600 dark:text-blue-400">300-400+ WPM</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Use the scientifically proven RSVP (Rapid Serial Visual Presentation) technique to dramatically improve your reading speed while maintaining comprehension.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <BoltIcon class="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
            <p class="text-gray-600 dark:text-gray-400">Eliminate distractions and improve concentration by focusing on one word at a time.</p>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <DocumentTextIcon class="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Multiple Formats</h3>
            <p class="text-gray-600 dark:text-gray-400">Support for TXT, PDF, DOCX files, or simply paste your text directly.</p>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <EyeIcon class="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Better Focus</h3>
            <p class="text-gray-600 dark:text-gray-400">Reduce eye movement and improve concentration with optimal reading point highlighting.</p>
          </div>
        </div>
      </div>

      <!-- File Upload Section -->
      <div class="mb-8">
        <FileUploader @text-extracted="handleTextExtracted" />
      </div>

      <!-- Text Input Section -->
      <div v-if="!currentText" class="mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Or paste your text here:</h3>
          <textarea
            v-model="textInput"
            placeholder="Paste your text here to start speed reading..."
            class="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div class="flex justify-between items-center mt-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ textInput.length }} characters, {{ wordCount }} words
            </div>
            <div class="space-x-3">
              <button
                v-if="textInput"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                @click="clearText"
              >
                Clear
              </button>
              <button
                :disabled="!textInput.trim()"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                @click="startReading"
              >
                Start Reading
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Speed Reader Component -->
      <div v-if="currentText">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Reading Session</h2>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ currentText.split(/\s+/).length }} words
            </div>
          </div>
          <button
            class="flex items-center space-x-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            @click="loadNewText"
          >
            <ArrowLeftIcon class="w-4 h-4" />
            <span>Load New Text</span>
          </button>
        </div>
        
        <SpeedReader :text="currentText" />
      </div>

      <!-- Tips Section -->
      <div v-if="!currentText" class="mt-16">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Speed Reading Tips</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">Start Slow</h4>
                  <p class="text-gray-600 dark:text-gray-400">Begin with 200-250 WPM and gradually increase as you get comfortable.</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">Focus on the Center</h4>
                  <p class="text-gray-600 dark:text-gray-400">Look at the red highlighted character - this is the optimal reading point.</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">Minimize Subvocalization</h4>
                  <p class="text-gray-600 dark:text-gray-400">Try not to "hear" the words in your head - just absorb the meaning.</p>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">Practice Regularly</h4>
                  <p class="text-gray-600 dark:text-gray-400">Consistent practice is key to building and maintaining speed reading skills.</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-white text-sm font-bold">5</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">Use Keyboard Shortcuts</h4>
                  <p class="text-gray-600 dark:text-gray-400">Master the keyboard shortcuts for a seamless reading experience.</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-white text-sm font-bold">6</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">Adjust Settings</h4>
                  <p class="text-gray-600 dark:text-gray-400">Experiment with different WPM speeds and chunk sizes to find your optimal settings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="text-center space-y-4">
          <div class="flex items-center justify-center space-x-2">
            <BookOpenIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span class="font-semibold text-gray-900 dark:text-white">Speed Reader</span>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            Boost your reading speed and comprehension with scientifically proven techniques.
          </p>
          <div class="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <span>Built with Nuxt 3 & Vue 3</span>
            <span>•</span>
            <span>RSVP Technology</span>
            <span>•</span>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  BookOpenIcon, 
  SunIcon, 
  MoonIcon, 
  BoltIcon, 
  EyeIcon, 
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

// Page metadata
useHead({
  title: 'Speed Reader - Read Faster, Comprehend Better',
  meta: [
    {
      name: 'description',
      content: 'Advanced speed reading application using RSVP technique. Read 300-400+ WPM with better comprehension. Support for PDF, DOCX, and text files.'
    },
    {
      property: 'og:title',
      content: 'Speed Reader - Read Faster, Comprehend Better'
    },
    {
      property: 'og:description',
      content: 'Advanced speed reading application using RSVP technique. Read 300-400+ WPM with better comprehension.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// Dark mode state
const isDark = ref(false)

// Reactive state
const textInput = ref('')
const currentText = ref('')

// Computed properties
const wordCount = computed(() => {
  return textInput.value.trim().split(/\s+/).filter(word => word.length > 0).length
})

// Methods
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('darkMode', isDark.value.toString())
  }
}

const handleTextExtracted = (text) => {
  currentText.value = text
  textInput.value = ''
}

const startReading = () => {
  if (textInput.value.trim()) {
    currentText.value = textInput.value.trim()
    textInput.value = ''
  }
}

const clearText = () => {
  textInput.value = ''
}

const loadNewText = () => {
  currentText.value = ''
  textInput.value = ''
}

// Initialize dark mode
onMounted(() => {
  if (import.meta.client) {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      isDark.value = savedDarkMode === 'true'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    document.documentElement.classList.toggle('dark', isDark.value)
  }
})
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background-color: #f3f4f6; /* bg-gray-100 */
}
.dark textarea::-webkit-scrollbar-track {
  background-color: #1f2937; /* dark:bg-gray-800 */
}

textarea::-webkit-scrollbar-thumb {
  background-color: #9ca3af; /* bg-gray-400 */
  border-radius: 0.5rem;     /* rounded */
}
.dark textarea::-webkit-scrollbar-thumb {
  background-color: #4b5563; /* dark:bg-gray-600 */
}

textarea::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280; /* bg-gray-500 */
}
.dark textarea::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280; /* dark:bg-gray-500 */
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, color 0.2s ease;
}
</style>