# Personal Website

# Installation

`git clone https://github.com/yufengliu15/yufengliu.git`

Go into directory and run: `npm install`

# Deployment

To deploy app locally: `npm start`

To deploy to gh-pages branch: `npm run deploy`

# Add posts template
```json
{
    "id": "project1",
    "title": "",
    "description": "",
    "technologies": [""],
    "image": "",
    "link": "",
    "date": ""
}
```
For image, make sure to add to `src/assets/images`. The `image` value can just be the name of the image. 

# Generate Blog Post Objects (deprecated)
`npm run server`