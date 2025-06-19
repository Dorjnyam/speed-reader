<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <!-- Progress Bar -->
    <div class="space-y-3">
      <div class="flex justify-between items-center text-sm">
        <span class="text-gray-600 dark:text-gray-400">Reading Progress</span>
        <span class="font-medium text-gray-900 dark:text-white">
          {{ Math.round(progress) }}%
        </span>
      </div>
      
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full progress-bar transition-all duration-300"
          :style="{ width: `${progress}%` }"
        />
      </div>
      
      <!-- Word Position -->
      <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Word {{ currentWordIndex + 1 }} of {{ totalWords }}</span>
        <span>{{ remainingTime }}s remaining</span>
      </div>
    </div>
    
    <!-- Statistics -->
    <div class="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="text-center">
        <div class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ currentWPM }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Current WPM
        </div>
      </div>
      
      <div class="text-center">
        <div class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ totalWordsRead }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Words Read
        </div>
      </div>
      
      <div class="text-center">
        <div class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ formatTime(readingTime) }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Time Reading
        </div>
      </div>
    </div>
    
    <!-- Quick Navigation -->
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Quick Jump
        </span>
        <div class="flex space-x-1">
          <button
            class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Jump to beginning"
            @click="$emit('jumpToPosition', 0)"
          >
            Start
          </button>
          <button
            class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Jump to 25%"
            @click="$emit('jumpToPosition', Math.floor(totalWords * 0.25))"
          >
            25%
          </button>
          <button
            class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Jump to 50%"
            @click="$emit('jumpToPosition', Math.floor(totalWords * 0.5))"
          >
            50%
          </button>
          <button
            class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Jump to 75%"
            @click="$emit('jumpToPosition', Math.floor(totalWords * 0.75))"
          >
            75%
          </button>
        </div>
      </div>
      
      <!-- Position Slider -->
      <input
        type="range"
        :value="currentWordIndex"
        :max="totalWords - 1"
        min="0"
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        :disabled="isPlaying"
        @input="$emit('jumpToPosition', parseInt($event.target.value))"
      >
    </div>
    
    <!-- Reading Speed Chart (Mini) -->
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Speed History
        </span>
        <button
          class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          @click="showDetailedStats = !showDetailedStats"
        >
          {{ showDetailedStats ? 'Hide' : 'Show' }} Details
        </button>
      </div>
      
      <div v-if="showDetailedStats" class="space-y-2">
        <!-- Average WPM over time -->
        <div class="h-16 bg-gray-50 dark:bg-gray-900 rounded p-2">
          <div class="h-full flex items-end justify-between">
            <div
              v-for="(speed, index) in speedHistory"
              :key="index"
              class="bg-blue-500 w-1 rounded-t"
              :style="{ height: `${(speed / 600) * 100}%` }"
              :title="`${speed} WPM`"
            />
          </div>
        </div>
        
        <!-- Additional Stats -->
        <div class="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-gray-500 dark:text-gray-400">Avg Speed:</span>
            <span class="font-medium ml-1">{{ averageWPM }} WPM</span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Max Speed:</span>
            <span class="font-medium ml-1">{{ maxWPM }} WPM</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  currentWordIndex: {
    type: Number,
    default: 0
  },
  totalWords: {
    type: Number,
    default: 1
  },
  remainingTime: {
    type: Number,
    default: 0
  },
  currentWPM: {
    type: Number,
    default: 0
  },
  totalWordsRead: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0
  },
  isPlaying: Boolean
})

defineEmits(['jumpToPosition'])

const showDetailedStats = ref(false)

// Mock speed history for visualization
const speedHistory = ref([])
const averageWPM = ref(0)
const maxWPM = ref(0)

const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

// Watch for WPM changes to build history
watch(() => props.currentWPM, (newWPM) => {
  if (newWPM > 0) {
    speedHistory.value.push(newWPM)
    
    // Keep only last 20 readings
    if (speedHistory.value.length > 20) {
      speedHistory.value.shift()
    }
    
    // Calculate stats
    if (speedHistory.value.length > 0) {
      averageWPM.value = Math.round(
        speedHistory.value.reduce((a, b) => a + b, 0) / speedHistory.value.length
      )
      maxWPM.value = Math.max(...speedHistory.value)
    }
  }
})
</script>