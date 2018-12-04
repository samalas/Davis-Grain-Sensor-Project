import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BinsComponent } from './bins/bins.component';
import { SettingComponent } from './setting/setting.component';
import { LoginComponent } from './login/login.component';
import { BinStartComponent } from './bins/bin-start/bin-start.component';
import { BinImageDetailComponent } from './bins/bin-image-detail/bin-image-detail.component';
import { BinTrapDetailComponent } from './bins/bin-trap-detail/bin-trap-detail.component';



const appRoutes : Routes = [
	{ path: '', redirectTo: '/bins', pathMatch: 'full' },
	{ path: 'bins', component: BinsComponent, children: [
		{ path: '', component: BinStartComponent },
		{ path: 'graph/:id', component: BinImageDetailComponent },
		{ path: 'trap/:binid/:trapid', component: BinTrapDetailComponent }
	]},
	{ path: 'setting', component: SettingComponent },
	{ path: 'login', component: LoginComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(appRoutes)],
	exports: [RouterModule]
	
})
export class AppRoutingModule {

}