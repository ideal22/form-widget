import React from 'react'
import { createRoot } from 'react-dom/client'
import { ShadowWrapper } from './ShadowWrapper'
import { App } from './App'
import { WidgetConfig } from './types'

/**
 * Главная функция инициализации виджета.
 * 
 * Использование на сайте клиента:
 * 
 *   <div id="my-widget"></div>
 *   <script src="https://yourcdn.com/widget.js"></script>
 *   <script>
 *     FormWidget.init({
 *       container: '#my-widget',
 *       serviceId: 42,
 *       lang: 'ru',
 *       apiUrl: 'https://your-api.com/applications',
 *       onSuccess: (data) => console.log('Заявка отправлена', data),
 *       onError: (err) => console.error('Ошибка', err),
 *       meta: {
 *         utm_source: 'google',
 *         utm_campaign: 'summer_sale',
 *       }
 *     })
 *   </script>
 */
function init(config: WidgetConfig): void {
  // Находим контейнер
  let container: HTMLElement | null = null

  if (typeof config.container === 'string') {
    container = document.querySelector(config.container)
    if (!container) {
      console.error(`[FormWidget] Container "${config.container}" not found`)
      return
    }
  } else {
    container = config.container
  }

  // Монтируем React внутрь Shadow DOM
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <ShadowWrapper>
        <App config={config} />
      </ShadowWrapper>
    </React.StrictMode>
  )
}

/**
 * Можно монтировать несколько виджетов на одну страницу
 * через разные контейнеры.
 */
function initAll(configs: WidgetConfig[]): void {
  configs.forEach(init)
}

// Экспортируем на window чтобы работало как IIFE
// После сборки: window.FormWidget.init({ ... })
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).FormWidget = { init, initAll }
}

// Также экспортируем для случаев когда подключают через import
export { init, initAll }
export type { WidgetConfig }
