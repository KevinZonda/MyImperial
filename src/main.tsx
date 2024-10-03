import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider } from 'antd'
import { COLOUR_IMPERIAL_BLUE } from './const/Colour.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "PT Sans, sans-serif",
          borderRadius: 3,
          borderRadiusLG: 3,
          borderRadiusOuter: 3,
          borderRadiusSM: 3,
          borderRadiusXS: 3,
          colorPrimary: COLOUR_IMPERIAL_BLUE,
        }
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
