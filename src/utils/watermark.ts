/**
 * Añade marca de agua a una imagen antes de descargar o compartir
 * Esto promueve viralidad al hacer que cada imagen compartida sea un anuncio
 */
export async function addWatermark(
  imageUrl: string,
  watermarkText: string = 'Creado en DreamDuel.com',
  isPremium: boolean = false
): Promise<string> {
  if (isPremium) {
    // Usuarios premium no tienen marca de agua
    return imageUrl;
  }

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        resolve(imageUrl);
        return;
      }
      
      // Dibujar imagen original
      ctx.drawImage(img, 0, 0);
      
      // Configurar marca de agua
      const fontSize = Math.max(img.width / 30, 20);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      
      // Posicionar en la parte inferior central
      const x = canvas.width / 2;
      const y = canvas.height - 30;
      
      // Dibujar texto con borde
      ctx.strokeText(watermarkText, x, y);
      ctx.fillText(watermarkText, x, y);
      
      // Añadir logo/icono pequeño
      const logoSize = fontSize * 1.2;
      ctx.font = `${logoSize}px Arial`;
      ctx.fillText('✨', x - ctx.measureText(watermarkText).width / 2 - logoSize, y);
      
      // Convertir canvas a blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          resolve(imageUrl);
        }
      }, 'image/png');
    };
    
    img.onerror = () => {
      resolve(imageUrl);
    };
    
    img.src = imageUrl;
  });
}

/**
 * Descarga una imagen con marca de agua
 */
export async function downloadImageWithWatermark(
  imageUrl: string,
  filename: string,
  isPremium: boolean = false
): Promise<void> {
  const watermarkedUrl = await addWatermark(imageUrl, 'Creado en DreamDuel.com', isPremium);
  
  const link = document.createElement('a');
  link.href = watermarkedUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpiar URL temporal si se creó
  if (watermarkedUrl !== imageUrl) {
    setTimeout(() => URL.revokeObjectURL(watermarkedUrl), 100);
  }
}

/**
 * Comparte una historia en redes sociales con marca de agua
 */
export async function shareStory(
  storyTitle: string,
  imageUrl: string,
  storyUrl: string,
  isPremium: boolean = false
): Promise<void> {
  const watermarkedUrl = await addWatermark(imageUrl, 'DreamDuel.com', isPremium);
  
  if (navigator.share) {
    try {
      // Convertir URL a blob para compartir
      const response = await fetch(watermarkedUrl);
      const blob = await response.blob();
      const file = new File([blob], 'dreamduel-story.png', { type: 'image/png' });
      
      await navigator.share({
        title: storyTitle,
        text: `¡Mira esta increíble historia que creé en DreamDuel! ${storyUrl}`,
        files: [file],
      });
    } catch (error) {
      console.log('Error sharing:', error);
      // Fallback: copiar link al portapapeles
      await navigator.clipboard.writeText(storyUrl);
      alert('Link copiado al portapapeles');
    }
  } else {
    // Fallback para navegadores sin Web Share API
    await navigator.clipboard.writeText(storyUrl);
    alert('Link copiado al portapapeles. Comparte tu historia en redes sociales!');
  }
  
  // Limpiar URL temporal
  if (watermarkedUrl !== imageUrl) {
    setTimeout(() => URL.revokeObjectURL(watermarkedUrl), 1000);
  }
}

/**
 * Genera una imagen optimizada para redes sociales (Twitter, Instagram, etc.)
 */
export async function generateSocialImage(
  imageUrl: string,
  storyTitle: string,
  isPremium: boolean = false
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Tamaño optimizado para redes sociales (1200x630 para OG tags)
    canvas.width = 1200;
    canvas.height = 630;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      if (!ctx) {
        resolve(imageUrl);
        return;
      }
      
      // Calcular dimensiones para centrar la imagen
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      
      // Fondo oscuro
      ctx.fillStyle = '#000A0F';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar imagen centrada
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      if (!isPremium) {
        // Barra superior con título y marca
        ctx.fillStyle = 'rgba(0, 10, 15, 0.9)';
        ctx.fillRect(0, 0, canvas.width, 80);
        
        // Título
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.fillText(storyTitle.substring(0, 40), 30, 50);
        
        // Marca de agua en barra inferior
        ctx.fillStyle = 'rgba(0, 153, 255, 0.95)';
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText('✨ Creado en DreamDuel.com', canvas.width / 2, canvas.height - 22);
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          resolve(imageUrl);
        }
      }, 'image/jpeg', 0.9);
    };
    
    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
}
