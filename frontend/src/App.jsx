import React from 'react';
import { BrowserRouter,Route,RouterProvider,Routes, createBrowserRouter } from 'react-router-dom';
import Home from './pages/HomePage';
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  }
])

const App = () => {  
  return (
    <RouterProvider router={router}/>
  );
}

export default App;