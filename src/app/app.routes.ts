import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { PainelComponent } from './components/painel/painel.component';
import { FuncionariosComponent } from './components/funcionarios/funcionarios.component';
import { ClientesComponent } from './components/clientes/clientes.component';


export const routes: Routes = [

    {
        path: '', 
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'cadastro',
        component: CadastroComponent
    },
    {
        path: 'carrinho',
        component: CarrinhoComponent
    },
    {
        path: 'meus-pedidos',
        component: PedidosComponent
    },
    {
        path: 'painel',
        component: PainelComponent
    },
    {
        path: 'funcionarios',
        component: FuncionariosComponent
    },
    {
        path: 'clientes',
        component: ClientesComponent
    }
];