import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#2563EB',
          colorText: '#1E293B',
          colorBorder: '#E2E8F0',
          borderRadius: 12,
          fontFamily: '"OPPO Sans", "HarmonyOS Sans", "PingFang SC", "Microsoft YaHei", "Source Han Sans", Inter, Arial, sans-serif'
        }
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
