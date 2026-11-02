import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CarrinhoService } from './services/carrinho/carrinho.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'estetica_bemestar';
  quantidadeCarrinho: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(private carrinhoService: CarrinhoService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.carrinhoService.itens$.subscribe(itens => {
        this.quantidadeCarrinho = itens.reduce((total, i) => total + i.quantidade, 0);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}