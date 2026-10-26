import { API_URL } from '@/config';

export type GenerationErrorCode = 'upload' | 'license' | 'generate' | 'download';

/** Error de la API con un código traducible y, si existe, el detalle enviado por el backend */
export class GenerationError extends Error {
  readonly code: GenerationErrorCode;
  readonly detail?: string;

  constructor(code: GenerationErrorCode, detail?: string) {
    super(detail || code);
    this.name = 'GenerationError';
    this.code = code;
    this.detail = detail;
  }
}

export interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
  sessionId: string;
  licenseKey: string;
  characterImageUrl?: string;
}

async function readErrorDetail(response: Response): Promise<string | undefined> {
  try {
    const data = await response.json();
    return typeof data?.detail === 'string' ? data.detail : undefined;
  } catch {
    return undefined;
  }
}

/** Sube la imagen de referencia temporalmente y devuelve su URL */
export async function uploadReferenceImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload/image`, { method: 'POST', body: formData })
    .catch(() => { throw new GenerationError('upload'); });

  if (!response.ok) {
    throw new GenerationError('upload', await readErrorDetail(response));
  }

  const data = await response.json();
  return data.url;
}

/** Genera una imagen y devuelve su URL (remota o data URI en base64) */
export async function generateImage(params: GenerateImageParams): Promise<string> {
  const response = await fetch(`${API_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: params.prompt,
      negativePrompt: params.negativePrompt || undefined,
      style: 'fantasy',
      aspectRatio: '16:9',
      sessionId: params.sessionId,
      characterImages: params.characterImageUrl ? [params.characterImageUrl] : [],
      licenseKey: params.licenseKey
    })
  }).catch(() => { throw new GenerationError('generate'); });

  if (response.status === 403) {
    throw new GenerationError('license');
  }
  if (!response.ok) {
    throw new GenerationError('generate', await readErrorDetail(response));
  }

  const data = await response.json();
  return data.imageUrl;
}

function triggerDownload(href: string) {
  const link = document.createElement('a');
  link.href = href;
  link.download = `dreamduel-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Descarga la imagen generada en el dispositivo del usuario */
export async function downloadImage(imageUrl: string): Promise<void> {
  // Las imágenes en base64 se descargan directamente (evita "URI Too Long" en el proxy)
  if (imageUrl.startsWith('data:image')) {
    triggerDownload(imageUrl);
    return;
  }

  // Las URLs remotas pasan por el proxy del backend para evitar CORS
  const proxyUrl = `${API_URL}/generate/download?url=${encodeURIComponent(imageUrl)}`;
  const response = await fetch(proxyUrl).catch(() => { throw new GenerationError('download'); });
  if (!response.ok) {
    throw new GenerationError('download');
  }

  const objectUrl = URL.createObjectURL(await response.blob());
  triggerDownload(objectUrl);
  URL.revokeObjectURL(objectUrl);
}
