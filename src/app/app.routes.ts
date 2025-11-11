import { Routes } from '@angular/router';
import { AuthFrameComponent } from './utils/layout-holders/auth-frame-component/auth-frame-component';
import { MainAppFrameComponent } from './utils/layout-holders/main-app-frame-component/main-app-frame-component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthFrameComponent,
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'main-app',
    component: MainAppFrameComponent,
    //  canActivate: [authGuard],
    loadChildren: () => import('./main-app/mainapp.routes').then((m) => m.mainappRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
