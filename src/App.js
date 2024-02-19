import React, { useState, useEffect, useRef } from 'react';
import './App.css';


function App() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist'));
    if (savedPlaylist) {
      setPlaylist(savedPlaylist);
    }

    const lastPlayedTrackIndex = parseInt(localStorage.getItem('lastPlayedTrackIndex'));
    if (!isNaN(lastPlayedTrackIndex)) {
      setCurrentTrackIndex(lastPlayedTrackIndex);
    }

    const lastPlayedTime = parseFloat(localStorage.getItem('lastPlayedTime'));
    if (!isNaN(lastPlayedTime) && audioRef.current) {
      audioRef.current.currentTime = lastPlayedTime;
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    localStorage.setItem('lastPlayedTrackIndex', currentTrackIndex);
  }, [currentTrackIndex]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    const newPlaylist = [...playlist];

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const audioData = e.target.result;
        const audioObject = {
          name: file.name,
          data: audioData,
        };
        newPlaylist.push(audioObject);
        setPlaylist(newPlaylist);
      };
      reader.readAsDataURL(file);
    });
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    const trackData = playlist[index].data;
    audioRef.current.src = trackData;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleEnded = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      playTrack(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0); // Loop back to the beginning
      playTrack(0);
    }
  };

  const handleTimeUpdate = () => {
    localStorage.setItem('lastPlayedTime', audioRef.current.currentTime);
  };

  return (
    <div className='body'>
      {/* <div className='navi'>
        <header className="header">
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </header>
      </div> */}
      <div className="sub-container">
        <div className="audio-card">
          <h1>Audio Player</h1>
          <div className="input-container">
            <input type="file" accept=".mp3" onChange={handleFileUpload} multiple />
          </div>
          <div className="playlist">
            <h2>Playlist</h2>
            <div className="tracks">
              {playlist.map((file, index) => (
                <div key={index} className={`track ${index === currentTrackIndex ? 'current-track' : ''}`} onClick={() => playTrack(index)}>
                  {file.name}
                </div>
              ))}
            </div>
          </div>
          <div className="now-playing">
            <h2>Now Playing</h2>
            {playlist[currentTrackIndex] && (
              <div>
                {playlist[currentTrackIndex].name}
              </div>
            )}
          </div>
          <audio
            ref={audioRef}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            controls
            className="audio-player"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
