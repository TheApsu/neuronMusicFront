import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ReproductorComponent } from '../../components/reproductor/reproductor.component';
import { HttpService } from 'src/app/services/http.service';
import { CommonModule } from '@angular/common';
import { UiServices } from 'src/app/services/ui-services';
import { SelectCompanyComponent } from './components/select-company/select-company.component';
import { ElectronStoreService } from 'src/app/services/electron-store.service';
import { IpcService } from 'src/app/services/ipc.service';
import { environment } from 'src/environments/environment';
import { NetworkConnectionService } from 'src/app/services/network-connection.service';

const daysDicc: any = {
  L: 1,
  M: 2,
  Mi: 3,
  J: 4,
  V: 5,
  S: 6,
  D: 0
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReproductorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit, OnDestroy {
  public pong: boolean = false;
  public clicks = 0;
  public queue: any[] = [];
  private _currentIndex = 0;
  private _playlist: any[] = [];
  private _company: any = undefined;
  private _musicCategory: any[] = [];

  set musicCategory(value){
    this._musicCategory = value
  }

  get musicCategory(){
    return this._musicCategory;
  }

  set playlist(value: any[]){
    this._playlist = value;
  }

  get playlist(){
    return this._playlist;
  }

  set company(value){
    this._company = value;
  }

  get company(){
    return this._company;
  }

  constructor(
    private uiSv: UiServices,
    private httpSv: HttpService,
    private electronStoreSv: ElectronStoreService,
    private ipcSv: IpcService,
    private cdr: ChangeDetectorRef,
    private networkConnectionSv: NetworkConnectionService
  ){
    this.ipcSv.on("path", (event: any, data: any) => {
      console.log('data :>> ', data);
    })

    this.ipcSv.on("download error", (event: any, data: any) => {
      this.queue[this._currentIndex - 1].error = true;
      this.downloadMusic();
    })
    
    this.ipcSv.on("download progress", (event: any, progressData: any) => {
      const progress = progressData.percent;
      const progressInPercentages = progress * 100; // With decimal point and a bunch of numbers
      if(this.queue[this._currentIndex - 1]){
        this.queue[this._currentIndex - 1].progress = progressInPercentages;
      }
      this.cdr.detectChanges();
    });

    this.ipcSv.on("download complete", (event: any, file: any) => {
      this.downloadMusic();
    });

    this.ipcSv.on("queue", (event: any, data: any) => {
      console.log('queue  :>> ', data );
      this.queue = data;
      this.cdr.detectChanges();
      this.downloadMusic();
    })
  }

  async ngOnInit() {

    if(this.networkConnectionSv.status){
      const { data } = await this.uiSv.showPopover(
        SelectCompanyComponent,
        {}, '', null, 'md','', false
      );
      this.getSchedule(data.id);
    }else{
      const clientCompany = this.electronStoreSv.get('clientCompany');
      this.networkConnectionSv.status = false;
      this.setParameterPerCompany(clientCompany);
    }
  }

  async getSchedule(id: number){
    const clientCompany = this.electronStoreSv.get('clientCompany');
    const params = {
      companyId: id
    }
    const res: any = await this.httpSv.get('client', 'index', params);
    const data = res.data;
    this.setParameterPerCompany(data, clientCompany);
  }

  setParameterPerCompany(data: any, savedCompany?: any){
    this.company = data;
    console.log('data :>> ', data);
    const schedule = this.verifySchedule(data.schedule);
    const playlist: any[] = data.companyPlayList.filter((playlist: any) => playlist.companyScheduleId === schedule.id);
    const channel = this.setChannel(playlist);
    console.log('channel :>> ', channel);
    //AGRUPAR MUSICA POR CANAL
    const periods = this.getPeriods(channel, data);
    const musicCategory = this.getMusicCategory(channel, data)
    this.getMusic(periods, musicCategory);
    data.music.forEach((x: any) => x.progress = 0);
    if(this.networkConnectionSv.status){
      if(savedCompany){
        data.music.forEach((music: any) => {
          const findSavedMusic = savedCompany.music.find((savedMusic: any) => savedMusic.name === music.name);
          if(findSavedMusic && music.file !== findSavedMusic.file){
            console.log('music :>> ', music);
            music.redownload = true;
          }
        })
        
      }
      this.electronStoreSv.set('clientCompany', data);
      this.ipcSv.send("verify songs", data.music);
    }
  }

  getPeriods(channel: any, data: any){
    const channelDistribution: any[] = data.channelDistribution.filter((dist: any) => dist.channelId === channel.channelId && dist.distributionId);
    const distributionPeriod: any[] = [];
    const periods: any[] = [];
    channelDistribution.forEach(item => {
      const auxDistributionPeriod: any[] = data.DistributionPeriod.filter((dist: any) => dist.distributionId === item.distributionId );
      if(auxDistributionPeriod.length){
        distributionPeriod.push(...auxDistributionPeriod);
      }
    })

    distributionPeriod.forEach(item => {
      const auxPeriod: any[] = data.period.find((period: any) => period.id === item.periodId);
      if(!!auxPeriod){
        periods.push(auxPeriod);
      }
    })
    return periods;
  }

  getMusicCategory(channel: any, data: any): any[]{
    try{

      const channelDistribution: any[] = data.channelDistribution.filter((dist: any) => dist.channelId === channel.channelId && dist.distributionId);
      let distributionCategory: any[] = [];
      const musicCategory: any[] = [];
      channelDistribution.forEach(item => {
        const auxDistributionCategory: any[] = data.DistributionCategory.filter((dist: any) => dist.distributionId === item.distributionId);
        if(auxDistributionCategory.length && distributionCategory){
          distributionCategory.push(...auxDistributionCategory);
        }
      })
      distributionCategory = distributionCategory.map(i => i.categoryId);
      const auxDistributionCategory = new Set(distributionCategory);
      const arregloSinRepetidos = Array.from(auxDistributionCategory);
      arregloSinRepetidos.forEach(item => {
        const auxMusicCategory: any = data.musicCategory.filter((music: any) => music.categoryId === item);
        musicCategory.push(...auxMusicCategory);
      })
  
      return musicCategory;
    } catch(err) {
      console.error(err);
      return [];
    }
  }

  getMusic(periods: any[], musicCategory: any[]){
    // this.company.DistributionCategory;
    const playlist: any[] = [];
    const auxPlaylist: any[] = [];
    const actualDate = new Date();
    this.company.music.forEach((music: any) => {
      const musicDate = new Date(music.date);
      const diff = this.test(musicDate, actualDate);
      const isInPeriod = periods.find((period) => diff > period.init && diff < period.end);
      if(!!isInPeriod){
        playlist.push(music);
      }
    })

    playlist.forEach(music => {
      const categories = musicCategory.filter(item => item.musicId === music.id);
      if(categories.length){
        this.musicCategory.push(...categories);
        auxPlaylist.push(music);
      }
    })

    console.log('auxPlaylist :>> ', auxPlaylist);
    console.log('this.musicCategory :>> ', this.musicCategory);
    this.playlist = auxPlaylist;
  }

  monthDiff(d1: Date, d2: Date) { 
    let months; 
    months = (d2.getFullYear() - d1.getFullYear()) * 12; 
    months -= d1.getMonth(); 
    months += d2.getMonth(); 
    return months <= 0 ? 0 : months; 
  }

  test(d1: Date, d2: Date) { 
    const diff = this.monthDiff(d1, d2); 
    return diff;
  }

  setChannel(playlist: any[]){
    let channel = undefined;
    playlist.every((value, index) => {
      const playlistChannel = this.compareHours(value.init, playlist[index + 1]?.init);
      if(playlistChannel){
        channel = value;
        return false;
      }
      return true;
    })
    return channel;
  }

  verifySchedule(schedule: any[]){
    const actualDate = new Date();
    const actualDay = actualDate.getDay();
    for(const day of schedule){
      const days: any[] = day.days.split(',');
      const actualSchedule = !!days.find((day: string) => daysDicc[day] === actualDay);
      if(actualSchedule){
        const time = this.compareHours(day.init, day.end);
        if(time){
          return day;
        }
      }
    }
  }

  compareHours(init: string, finish: string){
    if(!finish) return true;
    const actualDate = new Date();
    const start: string[] = init.split(":");
    const end: string[] = finish.split(":");
    const startDate = new Date()
    startDate.setHours(Number(start[0]));
    startDate.setMinutes(Number(start[1]));

    const endDate = new Date();
    endDate.setHours(Number(end[0]));
    endDate.setMinutes(Number(end[1]));

    if(actualDate.getTime() > startDate.getTime() && actualDate.getTime() < endDate.getTime()){
      return true;
    }
    return false;
  }

  downloadMusic(){
    const music: any = this.queue[this._currentIndex]
    if(this._currentIndex < this.queue.length){
      this.ipcSv.send('download', {
        url: `${environment.api}/file/music/${music.file}`,
        properties: { 
          file: music.file,
          filename: music.name,
          id: music.id,
          directory: "assets/music",
        }
      });
    }
    this._currentIndex++;
  }

  ngOnDestroy(): void {
    console.log('Destroy');
    this.ipcSv.removeAllListeners('download complete');
    this.ipcSv.removeAllListeners('download progress');
    this.ipcSv.removeAllListeners('download error');
    this.ipcSv.removeAllListeners('queue');
    this.ipcSv.removeAllListeners('path');
    this.queue = [];
  }
}
