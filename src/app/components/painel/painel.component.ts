import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainelService } from '../../services/painel/painel.service';
import { PainelResumo } from '../../models/painel';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent implements OnInit {
  resumo?: PainelResumo;
  carregando = true;
  erro = '';

  constructor(private painelService: PainelService) {}

  ngOnInit() {
    this.painelService.getResumo().subscribe({
      next: (data) => {
        this.resumo = data;
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar dados do painel: ' + err.message;
        this.carregando = false;
      }
    });
  }
}