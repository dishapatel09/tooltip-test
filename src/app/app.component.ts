import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  showNavbar: boolean = false;
  title = 'Tooltip Application';
  toggleNavbar(): void {
    this.showNavbar = !this.showNavbar;
  }
}
