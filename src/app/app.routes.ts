import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/Paginas_iniciales/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/Paginas_iniciales/login/login.component').then(m => m.LoginComponent) },
  
  // Rutas protegidas para Administradores
  {
    path: 'gestion-alimentos',
    loadComponent: () => import('./pages/Administrador/gestion-alimentos/gestion-alimentos.component').then(m => m.GestionAlimentosComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADORES'] },
    children: [
      {
        path: 'crud',
        loadComponent: () => import('./components/crud-alimentos/crud-alimentos.component').then(m => m.CrudAlimentoComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADORES'], animation: 'animate__fadeInRight' }, 
      },
      {
        path: 'mostrar-alimentos',
        loadComponent: () => import('./components/mostrar-alimentos/mostrar-alimentos.component').then(m => m.MostrarAlimentosComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADORES'], animation: 'animate__fadeInLeft' }, 
      }
    ]
  },
  {
    path: 'crud-mesas',
    loadComponent: () => import('./pages/Administrador/crud-mesas/crud-mesas.component').then(m => m.CrudMesasComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADORES'], animation: 'animate__fadeInLeft' }, 
  },
  {
    path: 'gestion-usuarios',
    loadComponent: () => import('./pages/Administrador/gestion-usuario/gestion-usuario.component').then(m => m.GestionUsuarioComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADORES'] },
    children: [
      {
        path: 'register',
        loadComponent: () => import('./pages/Paginas_iniciales/register/register.component').then(m => m.RegisterComponent),
      }
    ]
  },

  // Rutas protegidas para Cocineros
  {
    path: 'pedidos-cocina',
    loadComponent: () => import('./pages/Cocina/pedidos-cocina/pedidos-cocina.component').then(m => m.PedidosCocinaComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['COCINEROS'] },
  },

  // Rutas protegidas para Meseros
  {
    path: 'facturacion',
    loadComponent: () => import('./pages/Meseros/facturacion/facturacion.component').then(m => m.FacturacionComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLEADOS'] }, 
  },
  {
    path: 'gestion-mesas',
    loadComponent: () => import('./pages/Meseros/gestion-mesas/gestion-mesas.component').then(m => m.GestionMesasComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLEADOS', 'ADMINISTRADORES'] }, 
  },
  {
    path: 'gestion-pedidos',
    loadComponent: () => import('./pages/Meseros/gestion-pedidos/gestion-pedidos.component').then(m => m.GestionPedidosComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLEADOS'] },
  },
  {
    path: 'reservas',
    loadComponent: () => import('./pages/Meseros/reservas/reservas.component').then(m => m.ReservasComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLEADOS'] }, 
  },

  // Ruta protegida de perfil de usuario
  {
    path: 'perfil-usuario',
    loadComponent: () => import('./pages/Pag_genericas/perfil-usuario/perfil-usuario.component').then(m => m.PerfilUsuarioComponent),
    canActivate: [authGuard], 
  },

  // Ruta de error para rutas no encontradas
  {
    path: '**',
    loadComponent: () => import('./pages/Pag_genericas/pagina-error/pagina-error.component').then(m => m.PaginaErrorComponent),
  },
];