const path = require("path")
const fs = require("fs")

const dirPath = path.join(__dirname, "../src/assets/blogcontent")

let postlist = []
let pagelist = []

function readTime(content) {
    const WPS = 275 / 60

    var images = 0
    const regex = /\w/

    let words = content.split(' ').filter((word) => {
        if (word.includes('<img')) {
            images += 1
        }
        return regex.test(word)
    }).length

    var imageAdjust = images * 4
    var imageSecs = 0
    var imageFactor = 12

    while (images) {
        imageSecs += imageFactor
        if (imageFactor > 3) {
            imageFactor -= 1
        }
        images -= 1
    }

    const minutes = Math.ceil(((words - imageAdjust) / WPS + imageSecs) / 60)

    if (minutes < 1){
        return 1
    }
    
    return minutes
}

const getPosts = () => {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return console.log("Failed to list contents of directory: " + err)
        }
        files.forEach((file, i) => {
            let obj = {}
            let post
            fs.readFile(`${dirPath}/${file}`, "utf8", (err, contents) => {
                const getMetadataIndices = (acc, elem, i) => {
                    if (/^---/.test(elem)) {
                        acc.push(i)
                    }
                    return acc
                }
                const parseMetadata = ({ lines, metadataIndices }) => {
                    if (metadataIndices.length > 0) {
                        let metadata = lines.slice(metadataIndices[0] + 1, metadataIndices[1])
                        metadata.forEach(line => {
                            obj[line.split(": ")[0]] = line.split(": ")[1]
                        })
                        return obj
                    }
                }
                const parseContent = ({ lines, metadataIndices }) => {
                    if (metadataIndices.length > 0) {
                        lines = lines.slice(metadataIndices[1] + 1, lines.length)
                    }
                    return lines.join("\n")
                }
                const lines = contents.split("\n")
                const metadataIndices = lines.reduce(getMetadataIndices, [])
                const metadata = parseMetadata({ lines, metadataIndices })
                const content = parseContent({ lines, metadataIndices })
                const read_time = readTime(content)
                var date = new Date(metadata.published)
                if (metadata.updated !== "null") {
                    date = new Date(metadata.updated)
                }
                const timestamp = date.getTime() / 1000

                post = {
                    id: timestamp,
                    title: metadata.title ? metadata.title : "No title given",
                    user_title: metadata.user_title ? metadata.user_title : "No title given",
                    published: metadata.published ? metadata.published : "No date given",
                    updated: (metadata.updated !== "null") ? metadata.updated : null,
                    readTime: read_time,
                    tags: metadata.tags ? metadata.tags : "No tags given",
                    content: content ? content : "No content given",
                }
                setTimeout(() => {
                    postlist.push(post)
                    if (i === files.length - 1) {
                        setTimeout(() => {
                            const sortedList = postlist.sort((a, b) => {
                                return a.id < b.id ? 1 : -1
                            })
                            let data = JSON.stringify(sortedList)
                            fs.writeFileSync("src/posts.json", data)
                            console.log(`Sent ${sortedList.length} blog posts to posts.json!`)
                        }, 500)
                    }
                }, 50)
            })
        })
    })
    return
}

getPosts()

