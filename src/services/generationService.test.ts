import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { API_URL } from '@/config';
import { GenerationError, downloadImage, generateImage, uploadReferenceImage } from './generationService';

const fetchMock = vi.fn();

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const baseParams = {
  prompt: 'un gato astronauta',
  sessionId: 'session-123',
  licenseKey: 'LICENSE-KEY'
};

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  fetchMock.mockReset();
});

describe('uploadReferenceImage', () => {
  it('sube el archivo y devuelve su URL', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { url: 'https://cdn/ref.png' }));
    const file = new File(['x'], 'ref.png', { type: 'image/png' });

    await expect(uploadReferenceImage(file)).resolves.toBe('https://cdn/ref.png');

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(`${API_URL}/upload/image`);
    expect((init.body as FormData).get('file')).toBeInstanceOf(File);
  });

  it('lanza un error "upload" con el detalle del backend', async () => {
    fetchMock.mockResolvedValue(jsonResponse(400, { detail: 'Formato no soportado' }));

    await expect(uploadReferenceImage(new File(['x'], 'a.png'))).rejects.toMatchObject({
      code: 'upload',
      detail: 'Formato no soportado'
    });
  });

  it('lanza un error "upload" si falla la red', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(uploadReferenceImage(new File(['x'], 'a.png'))).rejects.toMatchObject({ code: 'upload' });
  });
});

describe('generateImage', () => {
  it('envía los datos de la generación y devuelve la URL de la imagen', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { imageUrl: 'https://cdn/out.png' }));

    const result = await generateImage({ ...baseParams, characterImageUrl: 'https://cdn/ref.png' });

    expect(result).toBe('https://cdn/out.png');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(`${API_URL}/generate`);
    expect(JSON.parse(init.body)).toMatchObject({
      prompt: 'un gato astronauta',
      sessionId: 'session-123',
      licenseKey: 'LICENSE-KEY',
      characterImages: ['https://cdn/ref.png']
    });
  });

  it('omite el negative prompt vacío y la imagen de referencia ausente', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { imageUrl: 'x' }));

    await generateImage({ ...baseParams, negativePrompt: '' });

    const body = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(body).not.toHaveProperty('negativePrompt');
    expect(body.characterImages).toEqual([]);
  });

  it('lanza un error "license" cuando la licencia es inválida (403)', async () => {
    fetchMock.mockResolvedValue(jsonResponse(403, { detail: 'Invalid license' }));

    const error = await generateImage(baseParams).catch((e) => e);
    expect(error).toBeInstanceOf(GenerationError);
    expect(error.code).toBe('license');
  });

  it('lanza un error "generate" con el detalle del backend', async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { detail: 'GPU no disponible' }));

    await expect(generateImage(baseParams)).rejects.toMatchObject({ code: 'generate', detail: 'GPU no disponible' });
  });

  it('lanza un error "generate" sin detalle si la respuesta no es JSON', async () => {
    fetchMock.mockResolvedValue(new Response('Bad Gateway', { status: 502 }));

    await expect(generateImage(baseParams)).rejects.toMatchObject({ code: 'generate', detail: undefined });
  });
});

describe('downloadImage', () => {
  it('descarga las imágenes base64 sin pasar por el backend', async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await downloadImage('data:image/png;base64,AAAA');

    expect(fetchMock).not.toHaveBeenCalled();
    expect(click).toHaveBeenCalledOnce();
  });

  it('descarga las URLs remotas a través del proxy del backend', async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:local');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    fetchMock.mockResolvedValue(new Response(new Blob(['png'])));

    await downloadImage('https://comfy/out.png?a=1');

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/generate/download?url=${encodeURIComponent('https://comfy/out.png?a=1')}`);
    expect(click).toHaveBeenCalledOnce();
  });

  it('lanza un error "download" si el proxy falla', async () => {
    fetchMock.mockResolvedValue(new Response('', { status: 500 }));

    await expect(downloadImage('https://comfy/out.png')).rejects.toMatchObject({ code: 'download' });
  });
});
