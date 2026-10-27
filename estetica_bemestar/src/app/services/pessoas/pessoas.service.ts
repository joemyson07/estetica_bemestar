import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../../models/pessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7123/api/pessoas';

  cadastrar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }
}