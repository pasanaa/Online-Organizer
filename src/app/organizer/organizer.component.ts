import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Event } from 'src/app/organizer/Event';
import { formatDate, Time } from '@angular/common';
import { interval, Subscription  } from 'rxjs';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent implements OnInit {

  displayedColumns: string[] = ['eventDate', 'eventName', 'eventStartTime', 'eventEndTime', 'edit', 'delete'];
  dataSource = new MatTableDataSource<any>();
  EventsGrid = [
    {
      eventId: Math.random(),
      eventDate: new Date("2020-04-14"),
      eventName: "Test 1",
      eventStartTime: undefined,
      eventEndTime: undefined,
    }    
  ];
  event: Event;
  edit: Boolean;
  buttonVal: string;
  title : string;
  latestDate: Date;
  remainingTime : Date;
  subscription: Subscription;
  index;


  constructor() {
    this.buttonVal = "Save";
    this.edit = false;
    this.title = "Online Organizer"
    this.dataSource = new MatTableDataSource(this.EventsGrid);
  }

  ngOnInit() {
    this.event = new Event();
    this.event.EventDate = new Date();
    this.remainingTime = null;
    const source = interval(30000);
    this.subscription = source.subscribe(val => this.eventExpirer());
  }

  AddDetails() {
    var det = this.EventsGrid.findIndex(item => item.eventId == this.event.EventId);

    if (det >= 0 && this.edit == true) {

      this.EventsGrid[det].eventId = this.event.EventId;
      this.EventsGrid[det].eventDate = this.event.EventDate;
      this.EventsGrid[det].eventName = this.event.EventName;
      this.EventsGrid[det].eventStartTime = this.event.EventStartTime;
      this.EventsGrid[det].eventEndTime = this.event.EventEndTime;

      this.edit = false;
    }
    else {

      var obj = {
        eventId: Math.random(),
        eventDate: this.event.EventDate,
        eventName: this.event.EventName,
        eventStartTime: this.event.EventStartTime,
        eventEndTime: this.event.EventEndTime,
      };


      this.EventsGrid.push(obj);
      this.dataSource = new MatTableDataSource(this.EventsGrid);
      // this.toast.Success("Successfully Added!");
    }

    if (this.edit == false) {
      this.buttonVal = "Save";
    }

    this.clearFields();
  }

  editRow(row) {

    this.edit = true;

    if (this.edit == true) {
      this.buttonVal = "Edit";
    }

    this.event.EventId = row.eventId;
    this.event.EventDate = row.eventDate;
    this.event.EventName = row.eventName;
    this.event.EventStartTime = row.eventStartTime;
    this.event.EventEndTime = row.eventEndTime;
  }

  deleteRow(row) {
    this.index = this.EventsGrid.indexOf(row);
    this.EventsGrid.splice(this.index, 1);
    this.dataSource._updateChangeSubscription();
    // this.toast.Warning("Successfully Deleted!");
  }

  clearFields() {
    this.event.EventDate = new Date();
    this.event.EventName = "";
    this.event.EventStartTime = null;
    this.event.EventEndTime = null;
  }


  applyFilter() {
    const filterValue = this.event.EventSearch;
    this.dataSource.filter = filterValue.trim();
  }


  get sortData() {
    return this.EventsGrid.sort((a, b) => {
      return <any>new Date(a.eventDate) - <any>new Date(b.eventDate);
    });
  }

  latestEvent() {  
    if(this.EventsGrid.length > 0) {
      this.latestDate = this.EventsGrid[0].eventDate;
      this.remainingTime = new Date(this.latestDate);
      return formatDate(this.latestDate, 'EEEE d MMMM y', 'en_US') +' => '+ this.EventsGrid[0].eventName ;
    }
    else{
      this.remainingTime = null;
      return "No Upcoming Events!"
    }

  }

  endTimeValidator() {
    if(this.event.EventStartTime < this.event.EventEndTime)
      return false;
    else if(this.event.EventStartTime == null || this.event.EventEndTime == null)
      return false;
    else
      return true;
  }

  dateValidator() {
    this.latestDate = new Date();
    this.latestDate.setDate(this.latestDate.getDate() - 1);
    if( this.latestDate < this.event.EventDate)
      return false;
    else
      return true;
  }

  eventExpirer() {
    this.latestDate = new Date();
    this.latestDate.setDate(this.latestDate.getDate() - 1);

    if(this.EventsGrid.length > 0) {
      if( this.latestDate > this.EventsGrid[0].eventDate)
      this.deleteRow(this.EventsGrid[0]);
    }
  }

   
}
