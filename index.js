import express from "express";
import cors from 'cors'
import multer from "multer";
import { v4 as uuidv4} from "uuid";
import path from 'path';
import { log } from "console";
import fs from 'fs';
import {exec} from "child_process" //watch out
import { stderr, stdout } from "process";
const app = express();

// Ensure the uploads directory exists
const uploadDir = './uploads';


//multer middleware
const storage = multer.diskStorage({
    destination: function(req, res, cb){
       cb(null, "./uploads") 
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "-"+ uuidv4()+ path.extname(file.originalname));
    }
});

//multer configuration
const uplaod = multer({storage: storage});

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:5173"
        ],
        credentials: true
    })
)

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", 
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("./uploads", express.static("uploads"));


app.get('/', function(req, res){
    res.json({message: "Hello Ruhit Arman"});
})

app.post("/upload", uplaod.single('file'), function(req, res){
    const lessonId = uuidv4();
    const videoPath = req.file.path;
    const outputPath = `./uploads/courses/${lessonId}`;
    const hlsPath = `${outputPath}/index.m3u8`;

    if (!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath, {recursive: true});
    } 

    //ffmpeg cmd
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
    //not to be used in production
    exec(ffmpegCommand, (err, stdout, stderr) => {
        if(err){
            console.log(`exec error: ${err}`);
        }
        console.log(`stdout: ${stdout}`)
        if(stderr){
            console.log(`std error: ${stderr}`);
        }

        const videoUrl = `http://localhost:8000/upload/courses/${lessonId}/index.m3u8`;

        res.status(200).json({
            message: "video converted to hls format",
            videoUrl: videoUrl,
            lessonId: lessonId
        });
    });

})

app.listen(8000, function(){
    console.log('App is listening at poer 3000');
})