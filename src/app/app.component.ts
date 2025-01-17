import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {RequestService} from './request/request.service';
import {AppService} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  themes: string[] = [
    'Default',
    'Dark',
    'Cerulean',
    'Cosmo',
    'Cyborg',
    'Darkly',
    'Flatly',
    'Journal',
    'Litera',
    'Lumen',
    'Lux',
    'Materia',
    'Minty',
    'Morph',
    'Pulse',
    'Quartz',
    'Sandstone',
    'Simplex',
    'Sketchy',
    'Slate',
    'Solar',
    'Spacelab',
    'Superhero',
    'United',
    'Vapor',
    'Yeti',
    'Zephyr'
  ];

  layouts: string[] = [
    '2 Columns',
    '3 Columns'
  ];

  settings: string[] = [
    '2 Columns Layout',
    '3 Columns Layout',
    '---',
    'Use HTTP OPTIONS'
  ];

  isCustomTheme = false;
  selectedThemeUrl: SafeResourceUrl;
  showDocumentation = false;
  isTwoColumnLayout = true;
  useHttpOptions = false;

  version = '1.1.1-SNAPSHOT';
  isSnapshotVersion = this.version.endsWith('SNAPSHOT');

  constructor(
    private appService: AppService,
    private requestService: RequestService,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.requestService.getResponseObservable()
      .subscribe(() => {
        this.showDocumentation = false;
      });

    this.requestService.getDocumentationObservable()
      .subscribe(() => {
        this.showDocumentation = true;
      });

    this.appService.themeObservable.subscribe(theme => this.changeTheme(theme));
    this.changeTheme(this.appService.getTheme());

    this.appService.layoutObservable.subscribe(layout => this.changeLayout(layout));
    this.changeLayout(this.appService.getLayout());

    this.appService.httpOptionsObservable.subscribe(useHttpOptions => this.changeHttpOptions(useHttpOptions));
    this.changeHttpOptions(this.appService.getHttpOptions());
  }

  changeTheme(theme: string) {
    this.isCustomTheme = theme !== this.themes[0];
    if (this.isCustomTheme) {
      if (theme.toLowerCase() === 'dark') {
        this.selectedThemeUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://cdn.jsdelivr.net/npm/bootstrap-dark-5@1.0.1/dist/css/bootstrap-unlit.min.css');
      } else {
        this.selectedThemeUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl('https://bootswatch.com/5/' + theme.toLowerCase() + '/bootstrap.min.css');
      }
    }
    this.appService.setTheme(theme);
  }

  changeLayout(layout: string) {
    this.appService.setLayout(layout.substring(0, 1));
    this.isTwoColumnLayout = this.appService.getLayout() === '2';
  }

  changeHttpOptions(httpOptions: boolean) {
    this.appService.setHttpOptions(httpOptions);
    this.useHttpOptions = httpOptions;
  }

  selectSetting(setting: string) {
    if (setting.includes('OPTIONS')) {
      this.useHttpOptions = !this.useHttpOptions;
      this.appService.setHttpOptions(this.useHttpOptions);
    } else {
      this.changeLayout(setting)
    }
  }

  getThemeIconCheckStyle(theme: string): string {
    if (theme === this.appService.getTheme()) {
      return '';
    }

    return 'visibility: hidden';
  }

  getSettingsIconCheckStyle(setting: string): string {
    if ((setting.includes('OPTIONS') && this.useHttpOptions)
      || setting.includes(this.appService.getLayout())) {
      return '';
    }

    return 'visibility: hidden';
  }
}
