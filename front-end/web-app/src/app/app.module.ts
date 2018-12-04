import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BinsComponent } from './bins/bins.component';
import { EditBinComponent } from './bins/edit-bin/edit-bin.component';
import { SettingComponent } from './setting/setting.component';
import { LoginComponent } from './login/login.component';
import { BinListComponent } from './bins/bin-list/bin-list.component';
import { BinImageDetailComponent } from './bins/bin-image-detail/bin-image-detail.component';
import { BinTrapDetailComponent } from './bins/bin-trap-detail/bin-trap-detail.component';
import { BinComponent } from './bins/bin-list/bin/bin.component';
import { AppRoutingModule } from './app-routing.module';
import { BinStartComponent } from './bins/bin-start/bin-start.component';
import { TrapListComponent } from './bins/bin-list/bin/trap-list/trap-list.component';
import { TrapComponent } from './bins/bin-list/bin/trap-list/trap/trap.component';
import { CustomizeRTDisplayComponent } from './setting/customize-rt-display/customize-rt-display.component';
import { ImgLibraryComponent } from './setting/img-library/img-library.component';
import { DetectionNotificationComponent } from './setting/detection-notification/detection-notification.component';
import { AuthService } from './auth.service';
import { HttpModule} from '@angular/http';
import { ImageLibraryComponent } from './bins/bin-trap-detail/image-library/image-library.component';
import { ShowRealtimePictureComponent } from './bins/bin-trap-detail/show-realtime-picture/show-realtime-picture.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BinsComponent,
    EditBinComponent,
    SettingComponent,
    LoginComponent,
    BinListComponent,
    BinImageDetailComponent,
    BinTrapDetailComponent,
    BinComponent,
    BinStartComponent,
    TrapListComponent,
    TrapComponent,
    CustomizeRTDisplayComponent,
    ImgLibraryComponent,
    DetectionNotificationComponent,
    ImageLibraryComponent,
    ShowRealtimePictureComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule { }
