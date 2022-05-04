const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progressBar = $('#progress');
const progressSlider = $('.progress-slider');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  playedSongs: [],
  songs: [
    {
      name: "Ngày Khác Lạ",
      singer: "Đen x Giang Phạm",
      path: "./assets/music/Đen - Ngày Khác Lạ ft. Giang Pham, Triple D (M-V).mp3",
      image: "./assets/img/ngay-khac-la.png"
    },
    {
      name: "Happy Now",
      singer: "Kygo ft. Sandro Cavazza",
      path: "./assets/music/Kygo - Happy Now ft. Sandro Cavazza (Official Video).mp3",
      image:
        "./assets/img/happy-now.png"
    },
    {
      name: "In Your Eyes",
      singer: "Robin Schulz feat. Alida",
      path:
        "assets/music/Robin Schulz feat. Alida – In Your Eyes (Official Music Video).mp3",
      image: "./assets/img/in-your-eyes.png"
    },
    {
      name: "Cô Gái Bàn Bên",
      singer: "Đen ft. Lynk Lee",
      path: "./assets/music/Đen - Cô Gái Bàn Bên ft. Lynk Lee (w-lyrics).mp3",
      image:
        "assets/img/co-gai-ban-ben.png"
    },
    {
      name: "Firestone",
      singer: "Kygo ft. Conrad Sewell",
      path: "./assets/music/Kygo - Firestone ft. Conrad Sewell (Official Video).mp3",
      image:
        "./assets/img/firestone.png"
    },
    {
      name: "Papercut",
      singer: "Zedd ft. Troye Sivan",
      path: "./assets/music/Zedd - Papercut ft. Troye Sivan (Official Audio).mp3",
      image:
        "./assets/img/paper-cut.png"
    },
    {
      name: "Forever",
      singer: "Martin Garrix, Matisse & Sadko",
      path: "./assets/music/Martin Garrix, Matisse & Sadko - Forever (Official Music Video).mp3",
      image:
        "./assets/img/forever.png"
    },
    {
      name: "The Nights",
      singer: "Avicii",
      path: "./assets/music/Avicii - The Nights.mp3",
      image:
        "./assets/img/the-nights.png"
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
          <div class="song${index === this.currentIndex ? ' active' : ''}" data-index=${index}> 
          <div class="thumb" style="background-image: url(${song.image})">
          </div>
          <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
    })
    playlist.innerHTML = htmls.join('');
  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get() {
        return this.songs[this.currentIndex];
      }
    });
    Object.defineProperty(this, 'songListLength', {
      get() {
        return this.songs.length;
      }
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    const handleNextSong = function () {
      if (_this.isRepeat)
        _this.repeatSong();
      else if (_this.isRandom)
        _this.randomSong();
      else
        _this.nextSong();
      _this.scrollToActiveSong();
      audio.play();
    }
    const handlePreviousSong = function () {
      if (_this.isRepeat)
        _this.repeatSong();
      else if (_this.isRandom)
        _this.randomSong();
      else
        _this.previousSong();
      _this.scrollToActiveSong();
      audio.play();
    }
    // On scroll events
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop >= 0 ? cdWidth - scrollTop : 0;
      const opacity = newCdWidth / cdWidth;
      cd.style.width = newCdWidth + 'px';
      cd.style.opacity = opacity;
    }

    // Play Button clicking event
    playBtn.onclick = function () {
      if (_this.isPlaying)
        audio.pause();
      else
        audio.play();
    }

    // When the song is played
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdAnimation.play();
    }
    // When the song is paused
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdAnimation.pause();
    }

    //Progress bar events
    let updateProgressBar = function () {
      const currentProgress = audio.currentTime / audio.duration * 100 || 0;
      progressBar.value = currentProgress * 10;
      progressSlider.style.width = currentProgress + '%';
    }
    let updateTime = function () {
      audio.currentTime = progressBar.value * audio.duration / 1000 || 0;
    }
    progressBar.oninput = updateTime;
    audio.ontimeupdate = updateProgressBar;

    // Rotate the cd thumb
    let cdAnimation = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ],
      {
        duration: 15000,
        iterations: Infinity,
      })
    cdAnimation.pause();

    // Next and previous song
    nextBtn.onclick = function () {
      handleNextSong();
    }
    prevBtn.onclick = function () {
      handlePreviousSong();
    }

    // Random button on/off
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      this.classList.toggle('active', _this.isRandom);
    }

    // Repeat button on/off
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      this.classList.toggle('active', _this.isRepeat);
    }

    // Auto next song when the song ends
    audio.onended = function () {
      handleNextSong();
    }

    // Choose a song
    playlist.onclick = function (e) {
      let songElement = e.target.closest('.song:not(.active)');
      let optionElement = e.target.closest('.option');
      if (songElement && !optionElement) {
        let newIndex = Number(songElement.dataset.index);
        _this.changeSongStatus(_this.currentIndex, newIndex);
        _this.currentIndex = newIndex;
        _this.loadCurrentSong();
        audio.play();
      }
    }
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    let nextIndex = (this.currentIndex + 1) % this.songListLength;
    this.changeSongStatus(this.currentIndex, nextIndex);
    this.currentIndex = nextIndex;
    this.loadCurrentSong();
    let anotherIndex = 1;
  },
  previousSong: function () {
    let previousIndex = (this.currentIndex + this.songListLength - 1) % this.songListLength;
    this.changeSongStatus(this.currentIndex, previousIndex);
    this.currentIndex = previousIndex;
    this.loadCurrentSong();
  },
  randomSong: function () {
    let randomIndex;
    this.updatePlayedSongs();
    do {
      randomIndex = Math.floor(Math.random() * this.songListLength);
    } while (this.playedSongs.includes(randomIndex));
    this.changeSongStatus(this.currentIndex, randomIndex);
    this.currentIndex = randomIndex;
    this.loadCurrentSong();
  },
  repeatSong: function () {
    this.loadCurrentSong();
  },
  changeSongStatus: function (oldIndex, newIndex) {
    let songList = $$('.song');
    songList[oldIndex].classList.remove('active');
    songList[newIndex].classList.add('active');
  },
  scrollToActiveSong: function () {
    $('.song.active').scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  },
  updatePlayedSongs: function () {
    let n = this.playedSongs.unshift(this.currentIndex);
    if (n > this.songListLength / 2)
      this.playedSongs.pop();
    console.log(this.playedSongs);
  },
  start: function () {
    this.defineProperties();
    this.handleEvents();
    this.render();
    this.loadCurrentSong();
  }
}

app.start();