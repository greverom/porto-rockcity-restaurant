import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/Paginas_iniciales/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/Paginas_iniciales/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/Paginas_iniciales/register/register.component').then(m => m.RegisterComponent) },
  { path: 'gestion-alimentos', loadComponent: () => import('./pages/Administrador/gestion-alimentos/gestion-alimentos.component').then(m => m.GestionAlimentosComponent) },
  { path: 'gestion-usuarios', loadComponent: () => import('./pages/Administrador/gestion-usuario/gestion-usuario.component').then(m => m.GestionUsuarioComponent) },
  { path: 'pedidos-cocina', loadComponent: () => import('./pages/Cocina/pedidos-cocina/pedidos-cocina.component').then(m => m.PedidosCocinaComponent) },
  { path: 'facturacion', loadComponent: () => import('./pages/Meseros/facturacion/facturacion.component').then(m => m.FacturacionComponent) },
  { path: 'gestion-mesas', loadComponent: () => import('./pages/Meseros/gestion-mesas/gestion-mesas.component').then(m => m.GestionMesasComponent) },
  { path: 'gestion-pedidos', loadComponent: () => import('./pages/Meseros/gestion-pedidos/gestion-pedidos.component').then(m => m.GestionPedidosComponent) },
  { path: 'reservas', loadComponent: () => import('./pages/Meseros/reservas/reservas.component').then(m => m.ReservasComponent) },
  { path: 'perfil-usuario', loadComponent: () => import('./pages/Pag_genericas/perfil-usuario/perfil-usuario.component').then(m => m.PerfilUsuarioComponent) },
  { path: '**', loadComponent: () => import('./pages/Pag_genericas/pagina-error/pagina-error.component').then(m => m.PaginaErrorComponent) },
];