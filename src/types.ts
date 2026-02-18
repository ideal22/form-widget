/**
 * Конфиг который передаёт клиент при вызове FormWidget.init()
 */
export interface WidgetConfig {
  /** CSS селектор или DOM элемент куда монтировать виджет */
  container: string | HTMLElement

  /** ID сервиса / формы (для API запросов) */
  serviceId?: string | number

  /** Язык интерфейса */
  lang?: 'ru' | 'en' | 'uz'

  /** Callback после успешной отправки формы */
  onSuccess?: (data: FormData) => void

  /** Callback при ошибке */
  onError?: (error: Error) => void

  /** Дополнительные поля которые нужно передать на сервер (UTM метки и т.д.) */
  meta?: Record<string, string>

  /** URL твоего API (если не хочешь хардкодить в виджете) */
  apiUrl?: string
}

/**
 * Данные формы которые возвращаются в onSuccess
 */
export interface FormData {
  name: string
  phone: string
  email?: string
  message?: string
  serviceId?: string | number
  meta?: Record<string, string>
}
