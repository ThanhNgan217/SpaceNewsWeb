import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SpaceNews';

  public doUnload(): void {
    this.doBeforeUnload();
  }

  // Keep me Signed in
  public doBeforeUnload(): void {
    // Clear localStorage
    confirm('hello');
    localStorage.clear();
  }
}
