import { DatePipe } from "@angular/common";

export interface Post{
  id: number,
  date: Date,
  time: Date,
  location: string,
  priority: number,
  title: string,
  image: string,
  content: string,
  showInSlider: boolean,
  topicID: number,
  groupID:string,
  groupNames: string[]
}
