export default {
  common: {
    back: 'Volver',
    error: 'Error',
    close: 'Cerrar'
  },
  nav: {
    home: 'Inicio',
    images: 'Imágenes',
    gallery: 'Galería',
    gallerySubtitle: 'Inspírate con las mejores creaciones hechas en DreamDuel. Próximamente...',
    settings: 'Configuración'
  },
  home: {
    hero: {
      badge: 'Rápido • Fácil • Privado',
      heading1: 'Transforma tus ideas en',
      heading2: 'imágenes increíbles',
      description: 'Describe lo que imaginas y nuestra inteligencia artificial lo convierte en una imagen única en segundos.',
      ctaButton: 'Crear Imagen Ahora'
    },
    features: {
      feature1: {
        title: 'Creatividad Sin Esfuerzo',
        description: 'Escribe tu idea en cualquier idioma y obtén imágenes de alta calidad'
      },
      feature2: {
        title: 'Súper Rápido',
        description: 'Genera imágenes en segundos, no en minutos'
      },
      feature3: {
        title: 'Privacidad Total',
        description: 'No guardamos tus imágenes: las descargas directamente a tu dispositivo'
      }
    }
  },
  imageGenerator: {
    title: 'Generador de Imágenes IA',
    subtitle: 'Crea imágenes únicas con inteligencia artificial',
    step1: '1. Sube tu imagen de referencia',
    step2: '2. Opciones de Generación',
    promptLabel: 'Prompt (Descripción)',
    promptRequired: '*',
    promptWarning: 'CUALQUIER IDIOMA. LO MEJORAMOS AUTOMÁTICAMENTE.',
    promptPlaceholder: 'Ejemplo: una mujer con cabello largo y rizado, sonriendo, en un jardín con flores...',
    promptTip: '💡 Describe tu imagen en cualquier idioma. Lo mejoraremos automáticamente.',
    negativePromptLabel: 'Negative Prompt (Qué evitar)',
    negativePromptWarning: 'SIN DEJAR ESTE ESPACIO EN BLANCO (SOLO EN INGLÉS)',
    negativePromptPlaceholder: 'Ejemplo: borroso, baja calidad, distorsionado, mal dibujado...',
    negativePromptTip: '💡 Escribe en inglés lo que no quieres ver, separado por comas.',
    generateButton: 'Generar Imagen',
    generating: 'Generando Imagen...',
    licenseTitle: 'Tu Crédito',
    licenseButton: '🛒 Consigue tu crédito aquí',
    licensePlaceholder: 'Ingresa tu crédito de Gumroad...',
    helpButton: 'AYUDA',
    helpModalTitle: 'Cómo usar el Generador',
    helpStep1: '1. Sube una imagen de referencia si quieres guiar a la IA (opcional).',
    helpStep2: '2. Describe detalladamente lo que deseas en el Prompt (cualquier idioma).',
    helpStep3: '3. Escribe lo que NO quieres ver en el Negative Prompt.',
    helpStep4: '4. Introduce tu crédito (clave de Gumroad). Debes conseguirlo pagando a través de Gumroad para poder generar.',
    helpStep5: '5. Presiona Generar y espera la magia.',
    creditRefundNotice: '🔐 Por cada error técnico de nuestra parte, se te devolverá un crédito automáticamente.',
    uploadClick: 'Haz click para subir una imagen',
    maxSize: 'PNG, JPG (máx. 5MB)',
    removeImage: 'Quitar imagen',
    resultModal: {
      title: '¡Imagen Generada!',
      subtitle: 'Tu creación está lista para descargar',
      promptUsed: 'Prompt usado',
      downloadButton: 'Descargar Imagen',
      warningTitle: '¡No olvides descargar tu imagen!',
      warningText: 'La imagen solo estará disponible en esta ventana. Descárgala ahora para conservarla.'
    },
    helpModalClose: '¡Entendido!',
    errors: {
      licenseRequired: 'Por favor, ingresa tu crédito de Gumroad antes de generar.',
      license: 'Tu clave de licencia es inválida o se han acabado tus créditos. Por favor, compra uno nuevo.',
      invalidFile: 'Por favor selecciona un archivo de imagen válido.',
      fileTooLarge: 'La imagen es demasiado grande. Tamaño máximo: 5MB.',
      upload: 'Error al subir la imagen. Inténtalo de nuevo.',
      generate: 'Error al generar la imagen. Inténtalo de nuevo.',
      download: 'Error al descargar la imagen.'
    }
  },
  settings: {
    title: 'Configuración',
    preferences: {
      title: 'Preferencias',
      language: 'Idioma',
      languageDesc: 'Selecciona tu idioma preferido',
      languageChanged: 'Idioma cambiado a Español'
    },
    legal: {
      title: 'Legal y Soporte',
      terms: 'Términos y Condiciones',
      privacy: 'Política de Privacidad',
      about: 'Sobre DreamDuel'
    }
  },
  legal: {
    lastUpdated: 'Última actualización',
    contact: 'Contacto',
    terms: {
      title: 'Términos y Condiciones',
      section1: {
        title: 'Aceptación de los Términos',
        content: 'Al acceder y utilizar DreamDuel, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no deberás utilizar nuestro servicio.'
      },
      section2: {
        title: 'Descripción del Servicio',
        content: 'DreamDuel es un servicio de generación de imágenes mediante inteligencia artificial. Cada imagen generada consume un crédito, que se adquiere a través de Gumroad, y se descarga directamente. No almacenamos las imágenes generadas en nuestros servidores. Nos reservamos el derecho de modificar o discontinuar el servicio en cualquier momento.'
      },
      section3: {
        title: 'Créditos y Clave de Licencia',
        content: 'Tus créditos se entregan como una clave de licencia de Gumroad. Eres responsable de mantenerla en privado, ya que cualquier persona que la tenga podrá usar tus créditos. Si una generación falla por un error técnico de nuestra parte, el crédito se te devuelve automáticamente. Debes ser mayor de 13 años para usar este servicio.'
      },
      section4: {
        title: 'Imágenes Generadas y Derechos',
        content: 'Las imágenes generadas mediante nuestro servicio son descargadas directamente por ti y no se almacenan en nuestros servidores. Conservas todos los derechos sobre las imágenes que generes y descargues. Eres responsable del uso que hagas de las imágenes generadas y debes asegurarte de no infringir derechos de terceros.'
      },
      section5: {
        title: 'Conducta Prohibida',
        content: 'DreamDuel es un servicio apto para todo público. No debes usarlo para generar contenido ilegal, sexual o explícito, ofensivo, acosador, violento o que infrinja los derechos de terceros. Nos reservamos el derecho de invalidar las claves de licencia de quienes violen estos términos. El uso del servicio debe cumplir con todas las leyes aplicables.'
      },
      section6: {
        title: 'Propiedad Intelectual',
        content: 'Todo el contenido, características y funcionalidad del servicio son propiedad exclusiva de DreamDuel y están protegidos por derechos de autor, marcas registradas y otras leyes de propiedad intelectual.'
      },
      section7: {
        title: 'Limitación de Responsabilidad',
        content: 'DreamDuel se proporciona "tal cual" sin garantías de ningún tipo. No seremos responsables de daños indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de usar el servicio.'
      }
    },
    privacy: {
      title: 'Política de Privacidad',
      section1: {
        title: 'Información que Recopilamos',
        content: 'Los pagos se procesan a través de Gumroad, que recopila los datos de compra (como tu correo electrónico); nosotros solo recibimos tu clave de licencia para validar tus créditos. La imagen de referencia que subes se usa de forma temporal para generar tu imagen, y no almacenamos las imágenes generadas, ya que se descargan directamente a tu dispositivo. También recopilamos automáticamente información sobre tu uso del servicio, como dirección IP, tipo de navegador y páginas visitadas, mediante herramientas de analítica como Microsoft Clarity.'
      },
      section2: {
        title: 'Uso de la Información',
        content: 'Utilizamos tu información para proporcionar y mantener el servicio de generación de imágenes, validar tus créditos, mejorar nuestro servicio y proteger la seguridad de la plataforma. No utilizamos las imágenes que generas para ningún propósito, ya que no las almacenamos.'
      },
      section3: {
        title: 'Compartir Información',
        content: 'No vendemos tu información personal. Podemos compartir tu información con proveedores de servicios que nos ayudan a operar la plataforma, cuando la ley lo requiera, o con tu consentimiento.'
      },
      section4: {
        title: 'Cookies y Tecnologías Similares',
        content: 'Utilizamos cookies y tecnologías similares para recordar tus preferencias, entender cómo usas el servicio y mejorar tu experiencia. Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad del servicio.'
      },
      section5: {
        title: 'Seguridad de los Datos',
        content: 'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal. Sin embargo, ningún método de transmisión por Internet es 100% seguro, por lo que no podemos garantizar seguridad absoluta.'
      },
      section6: {
        title: 'Tus Derechos',
        content: 'Tienes derecho a acceder, corregir, eliminar o transferir tu información personal. También puedes oponerte al procesamiento de tus datos o solicitar la limitación del mismo. Contáctanos para ejercer estos derechos.'
      }
    }
  }
};
