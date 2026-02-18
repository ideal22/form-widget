import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'
import { WidgetConfig, FormData } from './types'

interface AppProps {
  config: WidgetConfig
}

/**
 * App — главный компонент виджета.
 * 
 * 🔧 СЮДА ВСТАВЛЯЙ СВОЮ ГОТОВУЮ ФОРМУ/КАЛЬКУЛЯТОР
 * config.serviceId, config.lang, config.apiUrl — всё доступно через props
 */
export const App: React.FC<AppProps> = ({ config }) => {
  const [values, setValues] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: FormData = {
        ...values,
        serviceId: config.serviceId,
        meta: config.meta,
      }

      // Отправка на API
      const apiUrl = config.apiUrl ?? '/api/applications'
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      setSuccess(true)
      config.onSuccess?.(payload)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error.message)
      config.onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="success">
          Ваша заявка принята! Мы свяжемся с вами в ближайшее время.
        </Alert>
      </Box>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h6" component="h2">
        Оставить заявку
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        name="name"
        label="Имя"
        value={values.name}
        onChange={handleChange}
        required
        fullWidth
        size="small"
      />

      <TextField
        name="phone"
        label="Телефон"
        value={values.phone}
        onChange={handleChange}
        required
        fullWidth
        size="small"
        type="tel"
      />

      <TextField
        name="email"
        label="Email"
        value={values.email}
        onChange={handleChange}
        fullWidth
        size="small"
        type="email"
      />

      <TextField
        name="message"
        label="Сообщение"
        value={values.message}
        onChange={handleChange}
        fullWidth
        size="small"
        multiline
        rows={3}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        fullWidth
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Отправляем...' : 'Отправить заявку'}
      </Button>
    </Box>
  )
}
