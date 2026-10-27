import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../../models/item';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  // ajuste a porta conforme o launchSettings.json / Swagger
  private apiUrl = 'http://localhost:5295/api/Itens';

  listarAtivos(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}?ativo=S`);
  }
}