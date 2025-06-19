<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <!-- Main Reader Display -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-blue-100 dark:border-gray-700">
      <!-- Reading Area -->
      <div class="text-center space-y-8">
        <!-- Focus Point and Word Display -->
        <div class="relative">
          <!-- Focus crosshair -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-1 h-1 bg-red-500 rounded-full opacity-30"/>
          </div>
          
          <!-- Current Word -->
          <div 
            class="font-mono text-6xl md:text-8xl font-bold text-gray-900 dark:text-white tracking-wider leading-none min-h-[120px] flex items-center justify-center"
            :class="{ 'animate-pulse': isPlaying }"
          >
            <span 
              v-if="currentWord"
              class="relative inline-block"
              :style="{ 
                color: getWordColor(),
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }"
            >
              <!-- Highlight center character(s) -->
              <span 
                v-for="(char, index) in currentWord" 
                :key="index"
                :class="{ 
                //   'text-red-600 dark:text-red-400 font-extrabold': isOptimalReadingPoint(index),
                //   'opacity-75': !isOptimalReadingPoint(index)
                }"
              >
                {{ char }}
              </span>
            </span>
            <span v-else class="text-gray-400 dark:text-gray-600 text-4xl">
              {{ texts.noTextSelected }}
            </span>
          </div>
          
          <!-- Word context (previous and next words) -->
          <div v-if="showContext && currentWord" class="mt-6 space-y-2">
            <div class="text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <span class="opacity-60">{{ getPreviousWord() }}</span>
              <span class="text-blue-600 dark:text-blue-400 font-semibold">{{ currentWord }}</span>
              <span class="opacity-60">{{ getNextWord() }}</span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex justify-center space-x-4">
          <button
            :disabled="!hasText"
            class="flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            :class="isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'"
            @click="toggleReading"
          >
            <component 
              :is="isPlaying ? PauseIcon : PlayIcon" 
              class="w-6 h-6" 
            />
            <span>{{ isPlaying ? texts.pause : texts.play }}</span>
          </button>
          
          <button
            :disabled="!hasText"
            class="flex items-center space-x-2 px-6 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="resetReading"
          >
            <ArrowPathIcon class="w-5 h-5" />
            <span>{{ texts.reset }}</span>
          </button>
        </div>

        <!-- Speed Controls -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- WPM Control -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ texts.wordsPerMinute }}
              </label>
              <div class="flex items-center space-x-3">
                <button
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  @click="adjustWPM(-25)"
                >
                  <MinusIcon class="w-4 h-4" />
                </button>
                <input
                  v-model.number="wpm"
                  type="range"
                  min="100"
                  max="1000"
                  step="25"
                  class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                >
                <button
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  @click="adjustWPM(25)"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>
              <div class="text-center">
                <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ wpm }}</span>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">WPM</span>
              </div>
            </div>

            <!-- Chunk Size Control -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ texts.wordsAtOnce }}
              </label>
              <select
                v-model.number="chunkSize"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="1">1 word</option>
                <option :value="2">2 words</option>
                <option :value="3">3 words</option>
                <option :value="4">4 words</option>
              </select>
            </div>

            <!-- Reading Options -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ texts.options }}
              </label>
              <div class="space-y-2">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    v-model="showContext"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ texts.showContext }}</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    v-model="pauseOnPunctuation"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ texts.pauseOnPunctuation }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress and Stats Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Progress Bar Component -->
      <ProgressBar
        :progress="progress"
        :current-word-index="currentWordIndex"
        :total-words="totalWords"
        :remaining-time="remainingTime"
        :current-w-p-m="wpm"
        :total-words-read="totalWordsRead"
        :reading-time="readingTime"
        :is-playing="isPlaying"
        @jump-to-position="jumpToPosition"
      />

      <!-- Text Preview -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">{{ texts.textPreview }}</h3>
        <div class="max-h-48 overflow-y-auto text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <p v-if="!hasText" class="italic">{{ texts.noTextPreview }}</p>
          <div v-else>
            <span
              v-for="(word, index) in words.slice(Math.max(0, currentWordIndex - 10), currentWordIndex + 20)"
              :key="index + Math.max(0, currentWordIndex - 10)"
              :class="{
                'bg-blue-200 dark:bg-blue-900 font-semibold': index + Math.max(0, currentWordIndex - 10) === currentWordIndex,
                'opacity-60': index + Math.max(0, currentWordIndex - 10) < currentWordIndex
              }"
              class="mr-1 px-1 rounded"
            >
              {{ word }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Keyboard Shortcuts -->
    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-3">{{ texts.keyboardShortcuts }}</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Space</kbd>
          <span class="text-gray-600 dark:text-gray-400">{{ texts.playPause }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">R</kbd>
          <span class="text-gray-600 dark:text-gray-400">{{ texts.reset }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">↑/↓</kbd>
          <span class="text-gray-600 dark:text-gray-400">{{ texts.adjustSpeed }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">←/→</kbd>
          <span class="text-gray-600 dark:text-gray-400">{{ texts.navigate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { PlayIcon, PauseIcon, ArrowPathIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})

// Reactive state
const isPlaying = ref(false)
const currentWordIndex = ref(0)
const wpm = ref(300)
const chunkSize = ref(1)
const showContext = ref(true)
const pauseOnPunctuation = ref(true)
const startTime = ref(null)
const readingTime = ref(0)
const intervalId = ref(null)

// Text processing
const words = computed(() => {
  if (!props.text) return []
  return props.text
    .split(/\s+/)
    .filter(word => word.trim().length > 0)
    .map(word => word.trim())
})

const hasText = computed(() => words.value.length > 0)
const totalWords = computed(() => words.value.length)

const currentWord = computed(() => {
  if (chunkSize.value === 1) {
    return words.value[currentWordIndex.value] || ''
  } else {
    const chunk = words.value.slice(
      currentWordIndex.value, 
      currentWordIndex.value + chunkSize.value
    )
    return chunk.join(' ')
  }
})

const progress = computed(() => {
  if (totalWords.value === 0) return 0
  return (currentWordIndex.value / totalWords.value) * 100
})

const remainingTime = computed(() => {
  const remainingWords = totalWords.value - currentWordIndex.value
  return Math.round((remainingWords / wpm.value) * 60)
})

const totalWordsRead = computed(() => currentWordIndex.value)

// Localization
const texts = {
  noTextSelected: 'Select text to begin',
  pause: 'Pause',
  play: 'Play',
  reset: 'Reset',
  wordsPerMinute: 'Words Per Minute',
  wordsAtOnce: 'Words at Once',
  options: 'Reading Options',
  showContext: 'Show Context',
  pauseOnPunctuation: 'Pause on Punctuation',
  textPreview: 'Text Preview',
  noTextPreview: 'Upload or paste text to see preview',
  keyboardShortcuts: 'Keyboard Shortcuts',
  playPause: 'Play/Pause',
  adjustSpeed: 'Adjust Speed',
  navigate: 'Navigate'
}

// Methods
const getWordColor = () => {
  const colors = [
    // '#3B82F6', // blue
    // '#10B981', // green
    // '#F59E0B', // yellow
    // '#EF4444', // red
    // '#8B5CF6', // purple
    '#ffffff',
  ]
  return colors[currentWordIndex.value % colors.length]
}

// const isOptimalReadingPoint = (charIndex) => {
//   const word = currentWord.value
//   if (chunkSize.value > 1) return false
  
//   const length = word.length
//   let orp = 0
  
//   if (length <= 1) orp = 0
//   else if (length <= 5) orp = 1
//   else if (length <= 9) orp = 2
//   else if (length <= 13) orp = 3
//   else orp = 4
  
//   return charIndex === orp
// }

const getPreviousWord = () => {
  return words.value[currentWordIndex.value - 1] || ''
}

const getNextWord = () => {
  return words.value[currentWordIndex.value + 1] || ''
}

const toggleReading = () => {
  if (!hasText.value) return
  
  isPlaying.value = !isPlaying.value
  
  if (isPlaying.value) {
    startReading()
  } else {
    stopReading()
  }
}

const startReading = () => {
  if (!startTime.value) {
    startTime.value = Date.now()
  }
  
  const interval = 60000 / wpm.value // milliseconds per word
  
  intervalId.value = setInterval(() => {
    if (currentWordIndex.value >= totalWords.value - chunkSize.value) {
      stopReading()
      return
    }
    
    // Check for punctuation pause
    if (pauseOnPunctuation.value && shouldPauseOnPunctuation()) {
      setTimeout(() => {
        nextWord()
      }, 200) // Extra 200ms pause
    } else {
      nextWord()
    }
    
    // Update reading time
    readingTime.value = (Date.now() - startTime.value) / 1000
  }, interval)
}

const stopReading = () => {
  isPlaying.value = false
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}

const resetReading = () => {
  stopReading()
  currentWordIndex.value = 0
  startTime.value = null
  readingTime.value = 0
}

const nextWord = () => {
  if (currentWordIndex.value < totalWords.value - chunkSize.value) {
    currentWordIndex.value += chunkSize.value
  }
}

const shouldPauseOnPunctuation = () => {
  const word = words.value[currentWordIndex.value] || ''
  return /[.!?;:]$/.test(word)
}

const adjustWPM = (amount) => {
  const newWPM = wpm.value + amount
  if (newWPM >= 100 && newWPM <= 1000) {
    wpm.value = newWPM
    if (isPlaying.value) {
      stopReading()
      startReading()
    }
  }
}

const jumpToPosition = (index) => {
  if (index >= 0 && index < totalWords.value) {
    currentWordIndex.value = index
  }
}

// Keyboard shortcuts
const handleKeyPress = (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return
  }
  
  switch (event.code) {
    case 'Space':
      event.preventDefault()
      toggleReading()
      break
    case 'KeyR':
      event.preventDefault()
      resetReading()
      break
    case 'ArrowUp':
      event.preventDefault()
      adjustWPM(25)
      break
    case 'ArrowDown':
      event.preventDefault()
      adjustWPM(-25)
      break
    case 'ArrowLeft':
      event.preventDefault()
      if (currentWordIndex.value > 0) {
        currentWordIndex.value--
      }
      break
    case 'ArrowRight':
      event.preventDefault()
      if (currentWordIndex.value < totalWords.value - 1) {
        currentWordIndex.value++
      }
      break
  }
}

// Watch for WPM changes to restart reading with new speed
watch(wpm, () => {
  if (isPlaying.value) {
    stopReading()
    startReading()
  }
})

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  stopReading()
  document.removeEventListener('keydown', handleKeyPress)
})

// Auto-reset when text changes
watch(() => props.text, () => {
  resetReading()
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  background-color: #2563eb; /* Tailwind's blue-600 */
  border-radius: 9999px;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 1.25rem;
  height: 1.25rem;
  background-color: #2563eb; /* Tailwind's blue-600 */
  border-radius: 9999px;
  cursor: pointer;
  border: 0;
}

kbd {
  font-family: inherit;
}

.progress-bar {
  transition: width 0.3s ease;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
</style>