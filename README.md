# Form Widget Boilerplate

React + MUI виджет с Shadow DOM изоляцией. Собирается в один `widget.js` файл.

## Быстрый старт

```bash
npm install
npm run dev      # локальная разработка
npm run build    # сборка → dist/widget.js
```

## Структура

```
src/
  index.tsx          ← точка входа, экспортирует init() на window.FormWidget
  App.tsx            ← 🔧 СЮДА вставляй свою форму/калькулятор
  ShadowWrapper.tsx  ← Shadow DOM + Emotion cache изоляция
  types.ts           ← типы WidgetConfig, FormData
index.html           ← dev демо с намеренно конфликтующими стилями
vite.config.ts       ← сборка в IIFE формат
```

## Как вставить на сайт клиента

```html
<!-- 1. Контейнер -->
<div id="my-widget"></div>

<!-- 2. Подключить скрипт (разместить на CDN или своём сервере) -->
<script src="https://yourcdn.com/widget.js"></script>

<!-- 3. Инициализировать -->
<script>
  FormWidget.init({
    container: '#my-widget',
    serviceId: 42,
    lang: 'ru',
    apiUrl: 'https://your-api.com/api/applications',
    onSuccess: function(data) {
      console.log('Заявка принята', data)
      // можно редиректить, показывать свой попап и т.д.
    },
    onError: function(err) {
      console.error('Ошибка', err)
    },
    meta: {
      utm_source: 'google',
      page: 'landing_v2',
    }
  })
</script>
```

## Несколько виджетов на одной странице

```html
<div id="widget-header"></div>
<div id="widget-footer"></div>

<script>
  FormWidget.initAll([
    { container: '#widget-header', serviceId: 1 },
    { container: '#widget-footer', serviceId: 2 },
  ])
</script>
```

## Как добавить свою форму

Открой `src/App.tsx` и замени демо-форму на свою. Конфиг доступен через `props.config`:

```tsx
export const App: React.FC<AppProps> = ({ config }) => {
  // config.serviceId  — ID сервиса
  // config.lang       — язык
  // config.apiUrl     — URL API
  // config.meta       — UTM и прочие мета-данные
  // config.onSuccess  — callback после отправки
  
  // Вставляй сюда свою готовую форму
  return <MyExistingForm serviceId={config.serviceId} />
}
```

## Shadow DOM — зачем и как

Shadow DOM изолирует стили виджета от сайта клиента:
- Стили сайта (даже `* { color: red }`) **не попадают** внутрь виджета
- Стили MUI **не вытекают** на сайт клиента
- Это проверяется в `index.html` — там намеренно стоят конфликтующие стили

`ShadowWrapper.tsx` создаёт Shadow Root и настраивает Emotion cache внутри него,
поэтому все MUI стили инжектятся в Shadow DOM а не в `<head>`.

## Размер бандла

После `npm run build`:
- `dist/widget.js` — ~350kb (включает React + MUI)
- С gzip на CDN — ~100kb

Если нужно уменьшить размер:
- Используй только нужные MUI компоненты (tree-shaking уже включён)
- Можно вынести React как external если клиенты уже используют React

## Деплой

1. `npm run build` → получаем `dist/widget.js`
2. Заливаем на CDN (S3 + CloudFront, Cloudflare R2, etc.)
3. Версионирование: `widget.js` или `widget.v1.2.3.js`
4. Клиент подключает скрипт — готово
