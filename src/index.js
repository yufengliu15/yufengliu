import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
    Navigate
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
        path: "learning/:title",
        element: <Post></Post>,
    },
    {
        path: "gallery",
        element: <GalleryPage></GalleryPage>
    },
    {
        path: "*",
        element: <Navigate to={"/"}></Navigate>
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