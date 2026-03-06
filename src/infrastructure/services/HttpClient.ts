// HTTP Client Service
// Cliente HTTP configurado para conectar con el Backend

export class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    this.timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 60000; // 60s para Render free tier cold starts
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T = void>(endpoint: string): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (response.status === 204) {
      return undefined as T;
    }

    return this.handleResponse<T>(response);
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // Manejar respuestas exitosas sin contenido
    if (response.status === 204) {
      return undefined as T;
    }

    // Intentar parsear JSON
    const contentType = response.headers.get('content-type');
    const hasJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      if (hasJson) {
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          // Si falla el parse, usar mensaje por defecto
        }
      }

      // Manejar errores específicos
      if (response.status === 401) {
        // Token inválido o expirado
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }

      if (response.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción.');
      }

      if (response.status === 404) {
        throw new Error('Recurso no encontrado.');
      }

      if (response.status === 429) {
        throw new Error('Demasiadas solicitudes. Por favor intenta más tarde.');
      }

      if (response.status >= 500) {
        throw new Error('Error del servidor. Por favor intenta más tarde.');
      }

      throw new Error(errorMessage);
    }

    if (hasJson) {
      return await response.json();
    }

    return undefined as T;
  }

  /**
   * Método especial para upload de archivos (multipart/form-data)
   */
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

