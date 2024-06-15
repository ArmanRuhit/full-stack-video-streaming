import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VideoPlayer from './VideoPlayer'

function App() {
  const playerRef = useRef(null);
  const videoLink = 'http://localhost:8000/uploads/courses/0e408ac7-7a1e-4b33-bb64-b7c881877d2d/index.m3u8';

  

  const VideoPlayerOptions = {
      controls: true,
      responsive: true,
      fluid: true,
      sources:  [
        {
          src: videoLink,
          type: "application/x-mpegURL"
        }
      ]
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };
  return (
    <>
      <div>
        <h1>
          Video Player
        </h1>

        <VideoPlayer 
        options={VideoPlayerOptions} onReady={handlePlayerReady}></VideoPlayer>
      </div>
    </>
  )
}

export default App
