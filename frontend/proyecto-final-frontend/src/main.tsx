import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import App from './App.tsx'
import LoginScreen from './components/LoginScreen/LoginScreen.tsx';
import Home from './components/Home/Home.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<LoginScreen />}>

      </Route>
    </Routes>

  </BrowserRouter>
)
