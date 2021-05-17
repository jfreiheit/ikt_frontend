import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


export interface Post {
  id: number;
  title: string;
  location: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) { }


  public async addPost(post): Promise<Post> {
    return this.http
      .post<Post>(`${this.apiUrl}`, post, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .toPromise();
  }
}
