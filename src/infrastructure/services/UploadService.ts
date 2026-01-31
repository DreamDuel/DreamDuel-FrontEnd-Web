// Upload Service
// Servicio para subir archivos al backend/cloud storage

import { HttpClient } from './HttpClient';

export class UploadService {
  private http: HttpClient;
  private uploadEndpoint = '/api/upload';

  constructor() {
    this.http = new HttpClient();
  }

  /**
   * Sube una imagen al servidor
   * @param file Archivo de imagen a subir
   * @param folder Carpeta destino (stories, avatars, characters, etc.)
   * @returns URL de la imagen subida
   */
  async uploadImage(file: File, folder: 'stories' | 'avatars' | 'characters' = 'stories'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${this.uploadEndpoint}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Sube múltiples imágenes
   * @param files Array de archivos
   * @param folder Carpeta destino
   * @returns Array de URLs
   */
  async uploadMultipleImages(files: File[], folder: 'stories' | 'avatars' | 'characters' = 'stories'): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  }

  /**
   * Convierte File a base64 (fallback para desarrollo sin backend)
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Valida que el archivo sea una imagen válida
   */
  validateImageFile(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'El archivo debe ser una imagen' };
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: `La imagen debe ser menor a ${maxSizeMB}MB` };
    }

    return { valid: true };
  }
}
