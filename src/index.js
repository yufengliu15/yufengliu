import React from 'react';
import ReactDOM from 'react-dom';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import App from './App';
import { HomePage, ProjectPage, LearningPage, GalleryPage } from './pages';
import { Post } from "./components"


const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage></HomePage>,
    },
    {
        path: "learning",
        element: <LearningPage></LearningPage>,
            
        
    },
    {
        path: "learning/:id",
        element: <Post></Post>
    },
    {
        path: "gallery",
        element: <GalleryPage></GalleryPage>
    },
    // {
    //     path: "project",
    //     element: <ProjectPage></ProjectPage>
    // },

]);

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <RouterProvider router={router}/>
);