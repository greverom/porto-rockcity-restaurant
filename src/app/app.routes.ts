import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/Paginas_iniciales/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/Paginas_iniciales/login/login.component').then(m => m.LoginComponent) },
  
  // Rutas para Administradores
  {
    path: 'gestion-alimentos',
    loadComponent: () => import('./pages/Administrador/gestion-alimentos/gestion-alimentos.component').then(m => m.GestionAlimentosComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADORES'] },
    children: [
      {
        path: 'crud',
        loadComponent: () => import('./pages/Administrador/crud-alimentos/crud-alimentos.component').then(m => m.CrudAlimentoComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADORES'], animation: 'animate__fadeInRight' }, 
      },
      {
        path: 'mostrar-alimentos',
        loadComponent: () => import('./pages/Administrador/mostrar-alimentos/mostrar-alimentos.component').then(m => m.MostrarAlimentosComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADORES'], animation: 'animate__fadeInLeft' }, 
      }
    ]
  },
  {
    path: 'gestion-mesas',
    loadComponent: () => import('./pages/Administrador/gestion-mesas/gestion-mesas.component').then(m => m.GestionMesasComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADORES'] }, 
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
  {
    path: 'facturacion',
    loadComponent: () => import('./pages/Administrador/facturacion/facturacion.component').then(m => m.FacturacionComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADORES'] }, 
  },
  {
    path: 'reportes',
    loadComponent: () => 
      import('./pages/Administrador/reportes/reportes.component').then(m => m.ReportesComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADORES'] },
    children: [
      {
        path: 'facturas',
        loadComponent: () => 
          import('./pages/Administrador/facturas-reportes/facturas.component').then(m => m.FacturasComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADORES'] }
      },
      {
        path: 'balances',
        loadComponent: () => 
          import('./pages/Administrador/balances/balances.component').then(m => m.BalancesComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADORES'] },
        children: [
          {
            path: 'diario',
            loadComponent: () => 
              import('./components/balances/diario/balance-diario.component').then(m => m.BalanceDiarioComponent),
            canActivate: [authGuard, roleGuard],
            data: { roles: ['ADMINISTRADORES'] }
          },
          {
            path: 'semanal',
            loadComponent: () => 
              import('./components/balances/rango-fecha/balance-semanal.component').then(m => m.BalanceSemanalComponent),
            canActivate: [authGuard, roleGuard],
            data: { roles: ['ADMINISTRADORES'] }
          }
        ]
      }
    ]
  },
 
  // Rutas para Cocineros
  {
    path: 'pedidos-cocina',
    loadComponent: () => import('./pages/Cocina/pedidos-cocina/pedidos-cocina.component').then(m => m.PedidosCocinaComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['COCINEROS'] },
  },

  // Rutas para Meseros
  {
    path: 'gestion-pedidos',
    loadComponent: () => import('./pages/Meseros/gestion-pedidos/gestion-pedidos.component').then(m => m.GestionPedidosComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLEADOS'] },
  },
  {
    path: 'mesas-asignadas',
    loadComponent: () => import('./pages/Meseros/mesas-asignadas/mesas-asignadas.component').then(m => m.MesasAsignadasComponent),
  },
  {
    path: 'reservas',
    loadComponent: () => import('./pages/Administrador/reservas/reservas.component').then(m => m.ReservasComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLEADOS', 'ADMINISTRADORES'] }, 
  },

  // Ruta perfil de usuario
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