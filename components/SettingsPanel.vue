<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
      Reading Settings
    </h3>
    
    <div class="space-y-6">
      <!-- Speed Control -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Reading Speed
        </label>
        <div class="flex items-center space-x-4">
          <button
            class="btn-icon text-gray-600 dark:text-gray-400"
            title="Decrease speed"
            @click="$emit('decreaseSpeed')"
          >
            <MinusIcon class="h-4 w-4" />
          </button>
          
          <div class="flex-1">
            <input
              type="range"
              :value="wpm"
              min="100"
              max="800"
              step="25"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              @input="$emit('updateWpm', parseInt($event.target.value))"
            >
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>100</span>
              <span class="font-medium">{{ wpm }} WPM</span>
              <span>800</span>
            </div>
          </div>
          
          <button
            class="btn-icon text-gray-600 dark:text-gray-400"
            title="Increase speed"
            @click="$emit('increaseSpeed')"
          >
            <PlusIcon class="h-4 w-4" />
          </button>
        </div>
        
        <!-- Speed Presets -->
        <div class="flex space-x-2 mt-3">
          <button
            v-for="preset in speedPresets"
            :key="preset.wpm"
            :class="[
              'px-3 py-1 text-xs rounded-full transition-colors',
              wpm === preset.wpm 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
            @click="$emit('updateWpm', preset.wpm)"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>
      
      <!-- Reading Mode -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Reading Mode
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            :class="[
              'p-3 text-sm rounded-lg border transition-colors',
              readingMode === 'single'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
            @click="$emit('updateReadingMode', 'single')"
          >
            <div class="font-medium">Single Word</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Focus on one word</div>
          </button>
          
          <button
            :class="[
              'p-3 text-sm rounded-lg border transition-colors',
              readingMode === 'phrase'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
            @click="$emit('updateReadingMode', 'phrase')"
          >
            <div class="font-medium">Phrase Mode</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Show multiple words</div>
          </button>
        </div>
      </div>
      
      <!-- Chunk Size (for phrase mode) -->
      <div v-if="readingMode === 'phrase'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Words per Chunk
        </label>
        <select
          :value="chunkSize"
          class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="$emit('updateChunkSize', parseInt($event.target.value))"
        >
          <option value="2">2 words</option>
          <option value="3">3 words</option>
          <option value="4">4 words</option>
          <option value="5">5 words</option>
        </select>
      </div>
      
      <!-- Display Options -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Display Options
        </label>
        
        <div class="space-y-3">
          <!-- Font Size -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Font Size</span>
            <div class="flex items-center space-x-2">
              <button
                class="btn-icon text-gray-600 dark:text-gray-400"
                @click="$emit('updateFontSize', Math.max(fontSize - 2, 16))"
              >
                <MinusIcon class="h-3 w-3" />
              </button>
              <span class="text-sm font-medium w-12 text-center">{{ fontSize }}px</span>
              <button
                class="btn-icon text-gray-600 dark:text-gray-400"
                @click="$emit('updateFontSize', Math.min(fontSize + 2, 72))"
              >
                <PlusIcon class="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <!-- Font Family -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Font Family</span>
            <select
              :value="fontFamily"
              class="text-sm p-1 border border-gray-300 dark:border-gray-600 rounded 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              @change="$emit('updateFontFamily', $event.target.value)"
            >
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier</option>
            </select>
          </div>
          
          <!-- Focus Point -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Focus Point</span>
            <button
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                showFocusPoint ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              ]"
              @click="$emit('toggleFocusPoint')"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  showFocusPoint ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
          
          <!-- Pause on Punctuation -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Pause on Punctuation</span>
            <button
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                pauseOnPunctuation ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              ]"
              @click="$emit('togglePauseOnPunctuation')"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  pauseOnPunctuation ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Theme Colors -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Reading Area Theme
        </label>
        
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="theme in colorThemes"
            :key="theme.name"
            :class="[
              'p-2 rounded-lg border-2 transition-colors',
              backgroundColor === theme.background && textColor === theme.text
                ? 'border-blue-500'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            ]"
            :style="{ backgroundColor: theme.background, color: theme.text }"
            :title="theme.name"
            @click="$emit('updateTheme', theme)"
          >
            <div class="text-xs font-medium">Aa</div>
          </button>
        </div>
      </div>
      
      <!-- Keyboard Shortcuts -->
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          class="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300"
          @click="showShortcuts = !showShortcuts"
        >
          <span>Keyboard Shortcuts</span>
          <ChevronDownIcon 
            :class="[
              'h-4 w-4 transition-transform',
              showShortcuts ? 'rotate-180' : ''
            ]"
          />
        </button>
        
        <div v-show="showShortcuts" class="mt-3 space-y-2">
          <div
v-for="shortcut in keyboardShortcuts" :key="shortcut.key" class="flex justify-between text-xs">
            <span class="text-gray-600 dark:text-gray-400">{{ shortcut.action }}</span>
            <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
              {{ shortcut.key }}
            </kbd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  MinusIcon, 
  PlusIcon, 
  ChevronDownIcon 
} from '@heroicons/vue/24/outline'

defineProps({
  wpm: {
    type: Number,
    default: 300
  },
  readingMode: {
    type: String,
    default: 'single'
  },
  chunkSize: {
    type: Number,
    default: 3
  },
  fontSize: {
    type: Number,
    default: 32
  },
  fontFamily: {
    type: String,
    default: 'Georgia'
  },
  showFocusPoint: Boolean,
  pauseOnPunctuation: Boolean,
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#000000'
  }
})

defineEmits([
  'updateWpm',
  'increaseSpeed',
  'decreaseSpeed',
  'updateReadingMode',
  'updateChunkSize',
  'updateFontSize',
  'updateFontFamily',
  'toggleFocusPoint',
  'togglePauseOnPunctuation',
  'updateTheme'
])

const showShortcuts = ref(false)

const speedPresets = [
  { label: 'Slow', wpm: 200 },
  { label: 'Normal', wpm: 300 },
  { label: 'Fast', wpm: 400 },
  { label: 'Rapid', wpm: 500 }
]

const colorThemes = [
  { name: 'Light', background: '#ffffff', text: '#000000' },
  { name: 'Dark', background: '#1f2937', text: '#ffffff' },
  { name: 'Sepia', background: '#f7f3e9', text: '#5c4a37' },
  { name: 'High Contrast', background: '#000000', text: '#ffffff' },
  { name: 'Blue', background: '#dbeafe', text: '#1e40af' },
  { name: 'Green', background: '#dcfce7', text: '#166534' }
]

const keyboardShortcuts = [
  { action: 'Play/Pause', key: 'Space' },
  { action: 'Previous Word', key: '←' },
  { action: 'Next Word', key: '→' },
  { action: 'Increase Speed', key: 'Ctrl +' },
  { action: 'Decrease Speed', key: 'Ctrl -' },
  { action: 'Reset', key: 'Ctrl R' }
]
</script>