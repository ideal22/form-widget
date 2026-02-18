import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

interface ShadowWrapperProps {
  children: React.ReactNode
  theme?: ReturnType<typeof createTheme>
}

/**
 * ShadowWrapper монтирует children внутри Shadow DOM.
 * Это гарантирует что стили MUI/Emotion НЕ текут на сайт клиента
 * и стили сайта клиента НЕ влияют на виджет.
 */
export const ShadowWrapper: React.FC<ShadowWrapperProps> = ({
  children,
  theme,
}) => {
  const hostRef = useRef<HTMLDivElement>(null)
  const [shadowContainer, setShadowContainer] = useState<HTMLDivElement | null>(null)
  const [emotionCache, setEmotionCache] = useState<ReturnType<typeof createCache> | null>(null)

  useEffect(() => {
    if (!hostRef.current) return

    // Создаём Shadow Root
    const shadowRoot = hostRef.current.attachShadow({ mode: 'open' })

    // Контейнер для контента внутри shadow
    const container = document.createElement('div')
    container.id = 'widget-root'
    shadowRoot.appendChild(container)

    // Emotion должен инжектить стили ВНУТРЬ shadow root, не в <head>
    const cache = createCache({
      key: 'fw', // уникальный префикс (fw = form-widget)
      container: shadowRoot as unknown as HTMLElement,
      prepend: true,
    })

    setShadowContainer(container)
    setEmotionCache(cache)
  }, [])

  const defaultTheme = createTheme({
    // Твои MUI настройки темы здесь
    palette: {
      primary: {
        main: '#1976d2',
      },
    },
  })

  if (!shadowContainer || !emotionCache) {
    return <div ref={hostRef} />
  }

  return (
    <div ref={hostRef}>
      {createPortal(
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme ?? defaultTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </CacheProvider>,
        shadowContainer
      )}
    </div>
  )
}
