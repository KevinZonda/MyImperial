import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider } from 'antd'

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
        }
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
