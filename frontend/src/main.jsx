import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import { apiSlice } from './features/api/apiSlice.js';
import extendTheme from "./theme/index";
import './index.css'


// 2. Extend the theme to include custom colors, fonts, etc
const theme = extendTheme


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApiProvider api={apiSlice}>
    <ChakraProvider theme={theme}>
     <App className="App"/>
    </ChakraProvider>
    </ApiProvider>
  </React.StrictMode>,
)
