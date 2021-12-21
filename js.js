const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);
const PLAYER_STORAGE_KEY ='f8_PLAYER';
         const heading = $("header h2");
         const cdThumb = $(".cd-thumb");
         const audio = $("#audio");
         const player = $('.player');
        const cd = $(".cd");
        const playBtn = $('.btn-toggle-play');
        const progress = $("#progress");
    const prevBtn = $('.btn-prev');
    const nextBtn = $(".btn-next");
    const randomBtn = $('.btn-random');
    const repeatBtn = $('.btn-repeat')
    const playlist = $(".playlist");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: 
    JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
  songs: [
    {
      name: "Chia Tay",
      singer: "Bùi Anh Tuấn",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/song1.png",
    },
    {
      name: "Nơi Tình Yêu Kết Thúc",
      singer: "Bùi Anh Tuấn",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/song2.png",
    },
    {
      name: "Những Kẻ Mộng Mơ",
      singer: "Noo Phước Thịnh",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/song3.png",
    },
    {
      name: "Mãi Mãi Bên Nhau",
      singer: "Noo Phước Thịnh",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/song4.png",
    },
    {
      name: "Người Em Cố Đô",
      singer: "Rum, Đaa",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/song5.png",
    },
    {
      name: "Thương Em Là Điều Không Thể",
      singer: "Noo Phước Thịnh",
      path: "./assets/music/song6.mp3",
      image: "./assets/img/song6.png",
    },
    {
      name: "Đế Vương",
      singer: "ĐÌnh Dũng, ACV",
      path: "./assets/music/song7.mp3",
      image: "./assets/img/song7.png",
    },
    {
      name: "Hãy Trao Cho Anh",
      singer: "Sơn Tùng M-TP, Snoop-Dogg",
      path: "./assets/music/song8.mp3",
      image: "./assets/img/song8.png",
    },
    {
      name: "Đường Ta Chở Em Về",
      singer: "BuiTruongLinh",
      path: "./assets/music/song9.mp3",
      image: "./assets/img/song9.png",
    },
    {
      name: "Chờ Ngày Anh Nhận Ra em",
      singer: "Thùy Chi",
      path: "./assets/music/song10.mp3",
      image: "./assets/img/song10.png",
    },
  ],
  setConfig: function(key, value){
    this.config[key]= value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active': ''}" data-index= '${index}'>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
     
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, // 10 seconds
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    //  xử lý phóng to/ thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi song được player
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    //  khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //  khi next song
    nextBtn.onclick = function () {
        if(_this.isRandom){
            _this.playRandomSong()
        }else {
            _this.nextSong()
        }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }
    //  khi prev song
    prevBtn.onclick = function () {
          if (_this.isRandom) {
            _this.playRandomSong();
          } else {
            _this.pervSong();
          }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }

    // xử lý random bật / tắt 
    randomBtn.onclick = function(){
        _this.isRandom = !_this.isRandom;
        _this.setConfig("isRandom", _this.isRandom);
        randomBtn.classList.toggle("active", _this.isRandom);
    }

    // xử lý lặp lại 1 song
    repeatBtn.onclick = function(e){
    _this.isRepeat = !_this.isRepeat;
     _this.setConfig("isRepeat", _this.isRepeat);
        repeatBtn.classList.toggle("active", _this.isRepeat);

    }
    // xử lý next song khi audio ended
    audio.onended = function(){
        if (_this.isRepeat){
                audio.play();
        } else
        {
            nextBtn.click();
        }
    }
    // lắng nghe hành vi clock vào playlist
     playlist.onclick = function(e){
       const songNode = e.target.closest(".song:not(.active)");
        if (songNode || e.target.closest(".option")) {
          //  xử lý khi click vào song
          if (songNode) {
            _this.currentIndex = Number(songNode.dataset.index);
            _this.loadCurrentSong();
            _this.render();
             audio.play();
            
          }
          // xử lý khi click vào option
          if (e.target.closest(".option")) {
          }
        }
     }
  },
  scrollToActiveSong: function(){
      setTimeout(()=>{
         $(".song.active").scrollIntoView({
             behavior: 'smooth',
             block:"nearest",
         })
      },300)
   
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function(){
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  pervSong: function () {
    this.currentIndex--;
    if (this.currentIndex <0) {
      this.currentIndex = this.songs.length-1;
    }
    this.loadCurrentSong();
  },
playRandomSong : function (){
    let newIndex;
    do {
       newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex)
    this.currentIndex = newIndex;
    this.loadCurrentSong();
},
  start: function () {
    //   gán cấu hình config vào ứng dụng
    this.loadConfig();

    // định nghĩa các thuộc tính cho object
    this.defineProperties();

    // lắng nghe / xử lý các sự kiệm (DOM events)
    this.handleEvents();

    // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    //  hiển thị trạng thái ban đầu của 
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
    
  },
}; ;
 app.start();
