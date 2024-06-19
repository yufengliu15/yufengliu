import React from 'react';
import ReactDOM from 'react-dom';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import App from './App';
import { HomePage, ProjectPage, LearningPage, GalleryPage } from './pages';


const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage></HomePage>,
    },
    // {
    //     path: "project",
    //     element: <ProjectPage></ProjectPage>
    // },
    {
        path: "learning",
        element: <LearningPage></LearningPage>
    },
    {
        path: "gallery",
        element: <GalleryPage></GalleryPage>
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <RouterProvider router={router}/>
);