import React  from 'react';
import {RouterProvider} from "react-router-dom";
import {router} from './Menu.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function App() {
  return (
    <div className="App">
        <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    </div>
  );
}
