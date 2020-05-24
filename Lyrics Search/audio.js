export class Audio {
  constructor(parentElement) {
    this.pid = parentElement.dataset.mid;
    this.musicContainer = parentElement.querySelector('.music-container');
    this.playBtn = parentElement.querySelector('.play');
    this.image = parentElement.querySelector('.play_image');

    this.audio = parentElement.querySelector('.audio');
    this.progress = parentElement.querySelector('.progress');
    this.progressContainer = parentElement.querySelector('.progress-container');
    this.title = parentElement.querySelector('.title');
    this.cover = parentElement.querySelector('.cover');

    // Event listeners

    // Time/song update event
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));

    // Click on progress bar
    this.progressContainer.addEventListener(
      'click',
      this.setProgress.bind(this)
    );

    // Song ends
    this.audio.addEventListener('ended', () => {
      this.musicContainer.classList.remove('play');
      this.image.src = './img/play.svg';
    });
  }

  play = () => {
    const isPlaying = this.musicContainer.classList.contains('play');
    if (isPlaying) {
      this.pauseSong();
    } else {
      this.playSong();
    }
  };

  playSong = () => {
    this.image.setAttribute('src', './img/pause.svg');
    this.musicContainer.classList.add('play');

    this.audio.play();
  };

  pauseSong = () => {
    this.image.src = './img/play.svg';
    this.musicContainer.classList.remove('play');

    this.audio.pause();
  };

  updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    this.progress.style.width = `${progressPercent}%`;
  }

  setProgress(e) {
    // console.log(e);
    const width = e.target.clientWidth;
    const clickX = e.offsetX;
    const duration = this.audio.duration;

    this.audio.currentTime = (clickX / width) * duration;
    // console.log(clickX);
  }
}
