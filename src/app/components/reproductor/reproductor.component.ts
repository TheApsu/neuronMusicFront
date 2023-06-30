import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Howl, Howler } from 'howler';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ReproductorComponent  implements OnInit {
  @HostListener('window:resize') windowReisze(){
    this.resize();
  }

  public elms = ['track', 'timer', 'duration', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'playlistBtn', 'volumeBtn', 'progress', 'bar', 'wave', 'loading', 'playlist', 'list', 'volume', 'barEmpty', 'barFull', 'sliderBtn'];
  public playlist: any[] = [];
  public index: number = 0;
  public elmInObj: any = {};

  constructor() { }

  ngOnInit() {
    this.elms.forEach((elm: string ) => {
      if(elm){
        const el: any  = document.getElementById(elm);
        this.elmInObj[elm] = el;
      }
    });

    this.player( [
      {
        title: 'El cielo',
        file: 'cielo',
        howl: null
      },
      {
        title: '80s Vibe',
        file: '80s_vibe',
        howl: null
      },
      {
        title: 'Running Out',
        file: 'running_out',
        howl: null
      }
    ])

    this.elmInObj.playBtn.addEventListener('click', () => {
      this.play();
    });

    this.elmInObj.pauseBtn.addEventListener('click', () => {
      this.pause();
    });

    this.elmInObj.prevBtn.addEventListener('click', () => {
      this.skip('prev');
    });

    this.elmInObj.nextBtn.addEventListener('click', () => {
      this.skip('next');
    });

    // this.elmInObj.waveform.addEventListener('click', (event: any) => {
    //   this.seek(event.clientX / window.innerWidth);
    // });

    this.elmInObj.playlistBtn.addEventListener('click', () => {
      this.togglePlaylist();
    });

    this.elmInObj.playlist.addEventListener('click', () => {
      this.togglePlaylist();
    });

    this.elmInObj.volumeBtn.addEventListener('click', () => {
      this.toggleVolume();
    });

    this.elmInObj.volume.addEventListener('click', () => {
      this.toggleVolume();
    });

    this.elmInObj.barEmpty.addEventListener('click', (event: any) => {
      const per = event.layerX / parseFloat(this.elmInObj.barEmpty.scrollWidth);
      this.volume(per);
    });

    this.elmInObj.sliderBtn.addEventListener('mousedown', () => {
      this.elmInObj.sliderDown = true;
    });
    
    this.elmInObj.sliderBtn.addEventListener('touchstart', () => {
      this.elmInObj.sliderDown = true;
    });

    this.elmInObj.volume.addEventListener('mouseup', () => {
      this.elmInObj.sliderDown = false;
    });

    this.elmInObj.volume.addEventListener('touchend', () => {
      this.elmInObj.sliderDown = false;
    });

  }

  player(playlist: any){
    this.playlist = playlist;
    this.index = 0;
    // Display the title of the first track.
    this.elmInObj.track.innerHTML = '1. ' + playlist[0].title;

    // Setup the playlist display.
    playlist.forEach((song: any) => {
      const div = document.createElement('div');
      div.className = 'list-song';
      div.innerHTML = song.title;
      div.onclick = () => {
        this.skipTo(playlist.indexOf(song));
      };
      this.elmInObj.list.appendChild(div);
    });
  }

  play (index: number = 0) {
    let sound: any = undefined;
    const data = this.playlist[index];

    if (data.howl) {
      sound = data.howl;
    } else {
      const obj = {
        elmInObj: this.elmInObj,
        playlist: this.playlist,
        index: this.index,
        formatTime: this.formatTime,
        step: this.step
      }
      sound = data.howl = new Howl({
        
        src: [`${environment.api}/${data.file}.mp3`],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        onplay: () => {
          // Display the duration.
          this.elmInObj.duration.innerHTML = this.formatTime(Math.round(sound.duration()));

          // Start updating the progress of the track.
          
          requestAnimationFrame(this.step.bind(obj));

          // Start the wave animation if we have already loaded
          // wave.container.style.display = 'block';
          this.elmInObj.bar.style.display = 'none';
          this.elmInObj.pauseBtn.style.display = 'block';
        },
        onload: () => {
          // Start the wave animation.
          // wave.container.style.display = 'block';
          this.elmInObj.bar.style.display = 'none';
          this.elmInObj.loading.style.display = 'none';
        },
        onend: () => {
          // Stop the wave animation.
          // wave.container.style.display = 'none';
          this.elmInObj.bar.style.display = 'block';
          this.skip('next');
        },
        onpause: () => {
          // Stop the wave animation.
          // wave.container.style.display = 'none';
          this.elmInObj.bar.style.display = 'block';
        },
        onstop: () => {
          // Stop the wave animation.
          // wave.container.style.display = 'none';
          this.elmInObj.bar.style.display = 'block';
        },
        onseek: () =>  {
          // Start updating the progress of the track.
          requestAnimationFrame(this.step.bind(obj));
        }
      });
    }

    // Begin playing the sound.
    sound.play();

    // Update the track display.
    this.elmInObj.track.innerHTML = (index + 1) + '. ' + data.title;

    // Show the pause button.
    if (sound.state() === 'loaded') {
      this.elmInObj.playBtn.style.display = 'none';
      this.elmInObj.pauseBtn.style.display = 'block';
    } else {
      this.elmInObj.loading.style.display = 'block';
      this.elmInObj.playBtn.style.display = 'none';
      this.elmInObj.pauseBtn.style.display = 'none';
    }

    // Keep track of the index we are currently playing.
    this.index = index;
  }

  pause() {

    // Get the Howl we want to manipulate.
    const sound = this.playlist[this.index].howl;

    // Puase the sound.
    sound.pause();

    // Show the play button.
    this.elmInObj.playBtn.style.display = 'block';
    this.elmInObj.pauseBtn.style.display = 'none';
  }

  skip(direction: string) {

    // Get the next track based on the direction of the track.
    let index = 0;
    if (direction === 'prev') {
      index = this.index - 1;
      if (index < 0) {
        index = this.playlist.length - 1;
      }
    } else {
      index = this.index + 1;
      if (index >= this.playlist.length) {
        index = 0;
      }
    }

    this.skipTo(index);
  }

  skipTo(index: number) {
    // const self = this;

    // Stop the current track.
    if (this.playlist[index].howl) {
      this.playlist[index].howl.stop();
    }

    // Reset progress.
    this.elmInObj.progress.style.width = '0%';

    // Play the new track.
    this.play(index);
  }

  volume(val: number) {
    // const self = this;

    // Update the global volume (affecting all Howls).
    Howler.volume(val);

    // Update the display on the slider.
    const barWidth = (val * 90) / 100;
    this.elmInObj.barFull.style.width = (barWidth * 100) + '%';
    this.elmInObj.sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
  }

  seek(per: number) {

    // Get the Howl we want to manipulate.
    const sound = this.playlist[this.index].howl;

    // Convert the percent into a seek position.
    if (sound.playing()) {
      sound.seek(sound.duration() * per);
    }
  }

  step() {
    // Get the Howl we want to manipulate.
    const sound = this.playlist[this.index].howl;

    // Determine our current seek position.
    const seek = sound.seek() || 0;
    this.elmInObj.timer.innerHTML = this.formatTime(Math.round(seek));
    this.elmInObj.progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

    // If the sound is still playing, continue stepping.
    if (sound.playing()) {
      requestAnimationFrame(this.step.bind(this));
    }
  }

  /**
   * Toggle the playlist display on/off.
   */
  togglePlaylist() {
    // const self = this;
    const display = (this.elmInObj.playlist.style.display === 'block') ? 'none' : 'block';

    setTimeout(() => {
      this.elmInObj.playlist.style.display = display;
    }, (display === 'block') ? 0 : 500);
    
    this.elmInObj.playlist.className = (display === 'block') ? 'fadein' : 'fadeout';
  }

  /**
   * Toggle the volume display on/off.
   */
  toggleVolume() {
    const display = (this.elmInObj.volume.style.display === 'block') ? 'none' : 'block';

    setTimeout(() => {
      this.elmInObj.volume.style.display = display;
    }, (display === 'block') ? 0 : 500);
    this.elmInObj.volume.className = (display === 'block') ? 'fadein' : 'fadeout';
  }

  
  formatTime(secs: number) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  move (event: any) {
    if (this.elmInObj.sliderDown) {
      const x = event.clientX || event.touches[0].clientX;
      const startX = window.innerWidth * 0.05;
      const layerX = x - startX;
      const per = Math.min(1, Math.max(0, layerX / parseFloat(this.elmInObj.barEmpty.scrollWidth)));
      this.volume(per);
    }
  };

  // Update the height of the wave animation.
  // These are basically some hacks to get SiriWave.js to do what we want.
  resize () {
    const height = window.innerHeight * 0.3;
    const width = window.innerWidth;
    // wave.height = height;
    // wave.height_2 = height / 2;
    // wave.MAX = wave.height_2 - 4;
    // wave.width = width;
    // wave.width_2 = width / 2;
    // wave.width_4 = width / 4;
    // wave.canvas.height = height;
    // wave.canvas.width = width;
    // wave.container.style.margin = -(height / 2) + 'px auto';

    // Update the position of the slider.
    const sound = this.playlist[this.index].howl;
    if (sound) {
      const vol = sound.volume();
      const barWidth = (vol * 0.9);
      this.elmInObj.sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
    }
  }

  
  
}
