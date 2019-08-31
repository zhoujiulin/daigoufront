import { Component } from '@angular/core';
import { LoginAuthService } from './login-auth.service';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'daigoufront';
  public currentstatus: any;
  public languageBtn = 'français';
  public language = 'fr';
  public loginuser: any = {};

  constructor(private authService: LoginAuthService, private router: Router, public translateService: TranslateService) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    if(this.loginuser != null){
      this.router.navigate(['commandes']);
    }else{
      this.router.navigate(['login']);
    }

    this.currentstatus = this.authService.getStatus().subscribe(currentstatus => {
      this.currentstatus = currentstatus;
    });

    this.translateService.addLangs(['zh', 'fr']);
    this.translateService.setDefaultLang('fr');
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang.match(/zh|fr/) ? browserLang : 'fr');

    this.settingBtn(browserLang);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);
  }

  changeLanguage(lang: string) {
    this.translateService.use(lang);
    this.settingBtn(lang);
  }

  settingBtn(language: string) {
    if (language === 'zh') {
      this.languageBtn = 'français';
      this.language = 'fr';
    } else {
      this.languageBtn = '中文';
      this.language = 'zh';
    }
  }
}
