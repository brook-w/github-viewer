import axios from "axios";
export const fileHandlerMap = new Map()


const mdHandler = async (url, cb) => {
    const result = await axios.get(url);
    cb(result.data);
}

const imgHandler = async (url) => {
    window.open(url, "_blank");
}

const pdfHandler = async (url) => {
    window.open(url, "_blank")
}


const codeHandler = async (url, cb, ext) => {
    const result = await axios.get(url);
    cb("```" + ext + "\n" + result.data + "\n```");
}

const jsonHandler = async (url, cb, ext) => {
    fetch(url).then(res => {
        res.text().then(res => {
            cb("```" + ext + "\n" + res + "\n```");
        });
    })
}



fileHandlerMap.set("md", mdHandler)
fileHandlerMap.set("jpg", imgHandler)
fileHandlerMap.set("png", imgHandler)
fileHandlerMap.set("pdf", pdfHandler)

fileHandlerMap.set("txt", codeHandler)

fileHandlerMap.set("go", codeHandler)
fileHandlerMap.set("js", codeHandler)
fileHandlerMap.set("java", codeHandler)
fileHandlerMap.set("cs", codeHandler)
fileHandlerMap.set("yaml", codeHandler)
fileHandlerMap.set("yml", codeHandler)
fileHandlerMap.set("env", codeHandler)
fileHandlerMap.set("conf", codeHandler)
fileHandlerMap.set("cnf", codeHandler)
fileHandlerMap.set("py", codeHandler)
fileHandlerMap.set("sh", codeHandler)
fileHandlerMap.set("json", jsonHandler)
