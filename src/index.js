import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter} from "react-router-dom";

import { HomePage, LearningPage, GalleryPage } from './pages';
import { Navbar, Post } from "./components"

import "./globals.css"

export default function App() {
    return (
        <div className='background'>
            <div className='body'>
                <div className='header'>
                    <Navbar></Navbar>
                </div>
                <hr></hr>
                <div className='content'>
                    <BrowserRouter>
                        <Routes>
                            <Route index element={<HomePage />} />
                            <Route path="blog" element={<LearningPage />} />
                            <Route path="gallery" element={<GalleryPage />} />
                            <Route path="/blog/:title" element={<Post></Post>} />
                            <Route path="*" element={<HomePage />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <App></App>
);