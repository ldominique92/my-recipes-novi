import React  from 'react';
import './App.css';
import {RouterProvider} from "react-router-dom";
import {router} from './Menu.js';

export default function App() {
  return (
    <div className="App">
        <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    </div>
  );
}
