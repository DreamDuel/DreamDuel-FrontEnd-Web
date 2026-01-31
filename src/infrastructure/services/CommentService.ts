// Comment Service
// Servicio para sistema de comentarios

import { HttpClient } from './HttpClient';

export interface Comment {
  id: string;
  storyId: string;
  userId: string;
  username: string;
  avatarUrl: string;
  content: string;
  likes: number;
  createdAt: Date;
  replies?: Comment[];
}

export interface CreateCommentRequest {
  storyId: string;
  content: string;
  parentId?: string; // Para respuestas
}

export class CommentService {
  private http: HttpClient;
  private commentEndpoint = '/api/comments';

  constructor() {
    this.http = new HttpClient();
  }

  /**
   * Obtiene comentarios de una historia
   */
  async getComments(storyId: string): Promise<Comment[]> {
    return await this.http.get<Comment[]>(`${this.commentEndpoint}/story/${storyId}`);
  }

  /**
   * Crea un nuevo comentario
   */
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    return await this.http.post<Comment>(this.commentEndpoint, data);
  }

  /**
   * Actualiza un comentario
   */
  async updateComment(commentId: string, content: string): Promise<Comment> {
    return await this.http.put<Comment>(`${this.commentEndpoint}/${commentId}`, { content });
  }

  /**
   * Elimina un comentario
   */
  async deleteComment(commentId: string): Promise<void> {
    await this.http.delete(`${this.commentEndpoint}/${commentId}`);
  }

  /**
   * Da like a un comentario
   */
  async likeComment(commentId: string): Promise<{ liked: boolean; likesCount: number }> {
    return await this.http.post(`${this.commentEndpoint}/${commentId}/like`, {});
  }

  /**
   * Reporta un comentario
   */
  async reportComment(commentId: string, reason: string): Promise<void> {
    await this.http.post(`${this.commentEndpoint}/${commentId}/report`, { reason });
  }
}
