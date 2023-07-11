import { Injectable } from '@angular/core';
import { CompanySchedule } from 'src/assets/model/schedule.schema';
import { DatabaseService } from './database.service';
import Channel from 'src/assets/model/channel.schema';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private dbSv: DatabaseService
  ) {}

  getItems(repository: any) {
    const repo = this.dbSv.connection.getRepository(repository)
    return repo;
    // this.dbSv.connection.getRepository(repository);
  }

  addItem(item: CompanySchedule | Channel) {
    item.save();
  } 

  deleteItem(item: CompanySchedule | Channel) {
    item.remove();
  }
}
