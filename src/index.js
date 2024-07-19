import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";

import { HomePage, LearningPage, GalleryPage } from './pages';
import { Navbar, Post } from "./components"

import "./globals.css"

export default function App() {
    return (
        <div className='background'>
            <div className='body'>
                <Navbar></Navbar>
                <hr></hr>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<HomePage />} />
                        <Route path="learning" element={<LearningPage />} />
                        <Route path="gallery" element={<GalleryPage />} />
                        <Route path="learning/:title" element={<Post></Post>} />
                        <Route path="*" element={<HomePage />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <App></App>
);