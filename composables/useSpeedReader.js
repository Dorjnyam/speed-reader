export const useSpeedReader = () => {
  const words = ref([])
  const currentWordIndex = ref(0)
  const isPlaying = ref(false)
  const wpm = ref(300)
  const readingMode = ref('single') // single, phrase
  const showFocusPoint = ref(true)
  const pauseOnPunctuation = ref(true)
  
  // Statistics
  const startTime = ref(null)
  const totalWordsRead = ref(0)
  const readingTime = ref(0)
  
  // Settings
  const fontSize = ref(32)
  const fontFamily = ref('Georgia')
  const backgroundColor = ref('#ffffff')
  const textColor = ref('#000000')
  const chunkSize = ref(1)
  
  let intervalId = null
  
  const currentWord = computed(() => {
    if (words.value.length === 0) return ''
    
    if (readingMode.value === 'phrase') {
      const start = currentWordIndex.value
      const end = Math.min(start + chunkSize.value, words.value.length)
      return words.value.slice(start, end).join(' ')
    }
    
    return words.value[currentWordIndex.value] || ''
  })
  
  const progress = computed(() => {
    if (words.value.length === 0) return 0
    return (currentWordIndex.value / words.value.length) * 100
  })
  
  const remainingTime = computed(() => {
    if (words.value.length === 0) return 0
    const remainingWords = words.value.length - currentWordIndex.value
    return Math.ceil(remainingWords / (wpm.value / 60))
  })
  
  const currentWPM = computed(() => {
    if (!startTime.value || readingTime.value === 0) return 0
    return Math.round((totalWordsRead.value / readingTime.value) * 60)
  })
  
  const loadText = (text) => {
    // Clean and split text into words
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n]+/g, ' ')
      .trim()
    
    words.value = cleanText.split(' ').filter(word => word.length > 0)
    currentWordIndex.value = 0
    totalWordsRead.value = 0
    readingTime.value = 0
    startTime.value = null
  }
  
  const play = () => {
    if (words.value.length === 0) return
    
    isPlaying.value = true
    if (!startTime.value) {
      startTime.value = Date.now()
    }
    
    const interval = 60000 / wpm.value // milliseconds per word
    
    intervalId = setInterval(() => {
      nextWord()
    }, interval)
  }
  
  const pause = () => {
    isPlaying.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    
    // Update reading time
    if (startTime.value) {
      readingTime.value = (Date.now() - startTime.value) / 1000
    }
  }
  
  const nextWord = () => {
    if (currentWordIndex.value >= words.value.length - 1) {
      pause()
      return
    }
    
    // Check for punctuation pause
    if (pauseOnPunctuation.value && currentWord.value) {
      const word = currentWord.value
      if (word.includes('.') || word.includes('!') || word.includes('?') || word.includes(':') || word.includes(';')) {
        // Pause briefly for punctuation
        setTimeout(() => {
          currentWordIndex.value += readingMode.value === 'phrase' ? chunkSize.value : 1
          totalWordsRead.value += readingMode.value === 'phrase' ? chunkSize.value : 1
        }, 200) // 200ms pause for punctuation
        return
      }
    }
    
    currentWordIndex.value += readingMode.value === 'phrase' ? chunkSize.value : 1
    totalWordsRead.value += readingMode.value === 'phrase' ? chunkSize.value : 1
  }
  
  const previousWord = () => {
    if (currentWordIndex.value > 0) {
      currentWordIndex.value -= readingMode.value === 'phrase' ? chunkSize.value : 1
    }
  }
  
  const goToWord = (index) => {
    currentWordIndex.value = Math.max(0, Math.min(index, words.value.length - 1))
  }
  
  const reset = () => {
    pause()
    currentWordIndex.value = 0
    totalWordsRead.value = 0
    readingTime.value = 0
    startTime.value = null
  }
  
  const increaseSpeed = () => {
    wpm.value = Math.min(wpm.value + 25, 800)
    if (isPlaying.value) {
      pause()
      nextTick(() => play())
    }
  }
  
  const decreaseSpeed = () => {
    wpm.value = Math.max(wpm.value - 25, 100)
    if (isPlaying.value) {
      pause()
      nextTick(() => play())
    }
  }
  
  const togglePlayPause = () => {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }
  
  // Keyboard shortcuts
  const handleKeydown = (event) => {
    switch (event.code) {
      case 'Space':
        event.preventDefault()
        togglePlayPause()
        break
      case 'ArrowLeft':
        event.preventDefault()
        previousWord()
        break
      case 'ArrowRight':
        event.preventDefault()
        if (!isPlaying.value) nextWord()
        break
      case 'Equal':
      case 'NumpadAdd':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          increaseSpeed()
        }
        break
      case 'Minus':
      case 'NumpadSubtract':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          decreaseSpeed()
        }
        break
      case 'KeyR':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          reset()
        }
        break
    }
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })
  
  return {
    // State
    words: readonly(words),
    currentWordIndex: readonly(currentWordIndex),
    isPlaying: readonly(isPlaying),
    wpm,
    readingMode,
    showFocusPoint,
    pauseOnPunctuation,
    fontSize,
    fontFamily,
    backgroundColor,
    textColor,
    chunkSize,
    
    // Computed
    currentWord,
    progress,
    remainingTime,
    currentWPM,
    totalWordsRead: readonly(totalWordsRead),
    readingTime: readonly(readingTime),
    
    // Methods
    loadText,
    play,
    pause,
    nextWord,
    previousWord,
    goToWord,
    reset,
    increaseSpeed,
    decreaseSpeed,
    togglePlayPause,
    handleKeydown
  }
}