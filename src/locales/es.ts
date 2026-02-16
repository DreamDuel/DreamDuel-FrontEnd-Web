export default {
  common: {
    appName: 'DreamDuel',
    tagline: 'Tus historias cobran vida',
    loading: 'Cargando...',
    error: 'Error',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    edit: 'Editar',
    share: 'Compartir',
    back: 'Volver',
    next: 'Siguiente',
    skip: 'Saltar',
    start: 'Empezar'
  },
  nav: {
    home: 'Inicio',
    search: 'Buscar',
    create: 'Crear',
    profile: 'Perfil',
    settings: 'Configuración',
    myProfile: 'Mi Perfil'
  },
  home: {
    hero: {
      title: 'Crea Historias Visuales Únicas',
      subtitle: 'Convierte tus sueños en narrativas interactivas con IA',
      cta: 'Crear mi primera historia'
    },
    trending: {
      title: 'Tendencias',
      subtitle: 'Las historias más populares de la semana'
    },
    new: {
      title: 'Nuevas Historias',
      subtitle: 'Las últimas creaciones de la comunidad'
    },
    featured: {
      badge: 'MÁS POPULAR',
      reads: 'lecturas'
    }
  },
  create: {
    title: 'Genera Tu Historia',
    subtitle: 'Describe tu sueño y la IA lo convertirá en una historia visual única',
    titleLabel: 'Título de tu historia',
    titlePlaceholder: 'Ej: La Última Guardiana del Tiempo',
    titleRequired: 'Título (requerido)',
    prompt: {
      label: '¿Cuál es tu fantasía hoy?',
      placeholder: 'Ejemplo: Una guerrera espacial descubre un planeta olvidado donde la música controla la realidad...'
    },
    style: {
      label: 'Estilo Visual',
      anime: 'Anime',
      realistic: 'Realista',
      noir: 'Noir',
      watercolor: 'Acuarela',
      comic: 'Cómic',
      fantasy: 'Fantasía'
    },
    genre: {
      label: 'Género',
      romance: 'Romance',
      action: 'Acción',
      mystery: 'Misterio',
      scifi: 'Sci-Fi',
      horror: 'Terror',
      fantasy: 'Fantasía'
    },
    characters: {
      label: 'Personajes',
      subtitle: 'Añade fotos y nombres',
      optional: 'Opcional',
      addCharacter: 'Agregar Personaje',
      namePlaceholder: 'Nombre del personaje',
      descriptionPlaceholder: 'Descripción del personaje: edad, apariencia, vestimenta, características físicas...',
      limit: 'max',
      freePlan: 'Free: 2 max',
      premiumPlan: 'Premium: 10 max',
      limitReached: 'Límite alcanzado (Plan Free)',
      limitDesc: 'Has alcanzado el máximo de 2 personajes. Actualiza a Premium para usar hasta 10 personajes por historia.',
      upgradeToPremium: 'Actualizar a Premium',
      premiumLimitDesc: 'Has alcanzado el máximo de 10 personajes por historia'
    },
    visibility: {
      label: 'Visibilidad de la historia',
      public: 'Pública',
      publicDesc: 'Todos pueden verla',
      private: 'Privada',
      privateDesc: 'Solo tú la verás'
    },
    advancedOptions: {
      title: 'Opciones Avanzadas',
      genderLabel: 'Género del Personaje',
      female: 'Femenino',
      male: 'Masculino',
      bodyTypeLabel: 'Tipo de Cuerpo',
      femaleBody: 'Femenino',
      maleBody: 'Masculino',
      poseLabel: 'Referencia de Pose del Personaje',
      poseUpload: 'Haz click para subir una referencia de pose',
      poseMaxSize: 'PNG, JPG (máx. 5MB)',
      poseDescription: 'Sube una imagen de referencia mostrando la pose deseada para tu personaje'
    },
    generate: 'MATERIALIZAR',
    generating: 'GENERANDO MAGIA...',
    features: {
      instant: 'Generación instantánea',
      unique: '100% única y personalizada',
      unlimited: 'Ilimitadas posibilidades'
    }
  },
  search: {
    title: 'Descubre Historias',
    placeholder: 'Buscar historias, autores, géneros...',
    filters: 'Filtros',
    tags: 'Tags',
    visualStyle: 'Estilo Visual',
    sortBy: 'Ordenar por',
    sort: {
      popular: 'Más populares',
      recent: 'Más recientes',
      trending: 'En tendencia'
    },
    results: 'resultados',
    noResults: 'No se encontraron historias',
    tryDifferent: 'Intenta con otros términos de búsqueda'
  },
  profile: {
    stats: {
      stories: 'Historias',
      followers: 'Seguidores',
      following: 'Siguiendo',
      totalLikes: 'Likes'
    },
    tabs: {
      myStories: 'Mis Historias',
      saved: 'Guardadas',
      liked: 'Me gusta'
    },
    empty: {
      noStories: 'Aún no has creado historias',
      createFirst: 'Crear tu primera historia',
      noSaved: 'No tienes historias guardadas',
      noLiked: 'No has dado like a ninguna historia',
      explore: 'Explorar historias'
    },
    credits: {
      freeImages: 'Imágenes gratis',
      resetIn: 'Recarga en:',
      referralCode: 'Código de referido',
      copy: 'Copiar',
      referralDesc: '+3 imágenes por amigo invitado',
      referrals: 'invitados',
      referralCopied: '¡Link de referido copiado!'
    },
    premium: {
      active: 'Premium Activo',
      features: 'Imágenes ilimitadas • Sin marcas de agua',
      manage: 'Gestionar'
    },
    edit: {
      editProfile: 'Editar perfil',
      saveChanges: 'Guardar cambios',
      username: 'Nombre de usuario',
      bio: 'Biografía',
      bioPlaceholder: 'Biografía (opcional)',
      noBio: 'Sin biografía'
    },
    avatar: {
      uploading: 'Subiendo...',
      errorFormat: 'Por favor selecciona una imagen válida',
      errorSize: 'La imagen debe ser menor a 5MB'
    },
    logout: 'Cerrar sesión'
  },
  settings: {
    title: 'Configuración',
    account: {
      title: 'Cuenta',
      username: 'Nombre de usuario',
      email: 'Correo electrónico',
      bio: 'Biografía',
      bioPlaceholder: 'Cuéntanos sobre ti...',
      changePassword: 'Cambiar contraseña',
      saved: 'Perfil actualizado correctamente',
      passwordMismatch: 'Las contraseñas no coinciden',
      passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
      passwordUpdated: 'Contraseña actualizada correctamente',
      currentPassword: 'Contraseña actual',
      newPassword: 'Nueva contraseña',
      confirmPassword: 'Confirmar contraseña',
      update: 'Actualizar',
      saveChanges: 'Guardar cambios'
    },
    preferences: {
      title: 'Preferencias',
      notifications: 'Notificaciones',
      notificationsDesc: 'Recibe actualizaciones de tus historias',
      language: 'Idioma',
      languageDesc: 'Selecciona tu idioma preferido'
    },
    premium: {
      title: 'DreamDuel Premium',
      description: 'Desbloquea funciones exclusivas',
      features: {
        unlimited: 'Generación ilimitada',
        priority: 'Procesamiento prioritario',
        styles: 'Estilos exclusivos',
        commercial: 'Uso comercial',
        noAds: 'Sin anuncios',
        exclusiveStyles: 'Estilos visuales exclusivos'
      },
      cta: 'Mejorar a Premium',
      upgradeButton: 'Actualizar a Premium',
      price: '$9.99/mes'
    },
    legal: {
      title: 'Legal y Soporte',
      terms: 'Términos y Condiciones',
      privacy: 'Política de Privacidad',
      help: 'Centro de Ayuda',
      about: 'Sobre DreamDuel'
    },
    logout: 'Cerrar sesión',
    confirmLogout: '¿Estás seguro de que quieres cerrar sesión?'
  },
  story: {
    readNow: 'Leer Ahora',
    readStory: 'Leer Historia',
    like: 'Like',
    save: 'Guardar',
    author: 'Autor',
    follow: 'Seguir',
    scenes: 'Escenas de esta historia',
    scene: 'Escena',
    stats: {
      views: 'vistas',
      likes: 'me gusta',
      comments: 'comentarios'
    }
  },
  viewer: {
    ready: '¡Tu historia está lista!',
    subtitle: 'Ya puedes leerla o compartirla con el mundo',
    actions: {
      read: 'Leer Ahora',
      details: 'Ver Detalles',
      create: 'Crear Otra'
    },
    backHome: 'Volver al inicio'
  },
  loading: {
    messages: [
      'Creando mundos...',
      'Generando personajes...',
      'Tejiendo la trama...',
      'Dando vida a tu historia...'
    ]
  },
  onboarding: {
    slides: [
      {
        title: 'Crea Historias Únicas',
        description: 'Describe tu fantasía y la IA generará una historia visual personalizada'
      },
      {
        title: 'Personaliza Personajes',
        description: 'Sube fotos de tus personajes favoritos y dales vida en tu historia'
      },
      {
        title: 'Descubre Infinitas Historias',
        description: 'Explora creaciones de otros usuarios y encuentra tu próxima lectura favorita'
      },
      {
        title: '¡Empieza a Soñar!',
        description: 'Únete a miles de creadores y lectores en DreamDuel'
      }
    ]
  },
  guest: {
    header: {
      login: 'Iniciar Sesión',
      register: 'Registrarse Gratis'
    },
    hero: {
      title: 'Transforma tu Foto con IA',
      subtitle: 'Sube una foto y describe qué quieres hacer con ella. ¡Prueba gratis sin registro!',
      features: {
        noCard: 'Sin tarjeta',
        instant: 'Instantáneo',
        free: '100% gratis'
      }
    },
    steps: {
      uploadImage: 'Sube una foto de una persona',
      uploadClick: 'Haz click para subir una imagen',
      maxSize: 'PNG, JPG (máx. 5MB)',
      promptLabel: 'Describe lo que quieres crear',
      promptDescription: 'PROMPT - Describe lo que quieres ver',
      promptPlaceholder: 'Ejemplo: una persona en la playa al atardecer, con traje de baño deportivo, pose relajada, fondo con palmeras y olas del mar...',
      promptExample: 'Describe con detalle: escenario, vestimenta, pose, iluminación, ambiente...',
      negativePromptDescription: 'NEGATIVE PROMPT - Describe lo que NO quieres ver (Opcional)',
      negativePromptPlaceholder: 'Ejemplo: baja calidad, borroso, distorsionado, disfigurado, manos extra, rostro mal formado...',
      negativePromptExample: 'Indica qué elementos quieres evitar en la imagen generada',
      customizePhysical: 'Personaliza las características físicas (Opcional)',
      customizeDesc: 'Selecciona características físicas para transformar la persona de la foto',
      finalDescription: 'Descripción Final (Generado automáticamente)',
      additionalDetails: 'Agrega detalles adicionales: escenario, ambiente, accesorios, efectos especiales...',
      additionalExample: 'Ejemplo: "en una playa al atardecer con palmeras de fondo"',
      finalPrompt: 'Prompt Final (se enviará a la IA):',
      selectOrWrite: 'Selecciona opciones o escribe una descripción...',
      advancedOptions: 'Opciones Avanzadas',
      poseLabelLocked: 'Referencia de Pose del Personaje',
      registerRequired: 'Registro Requerido',
      poseUploadLocked: 'Sube una imagen de referencia de pose',
      registerToUnlock: 'Regístrate para desbloquear',
      registerToUnlockButton: 'Regístrate para Desbloquear',
      poseExample: 'Sube una imagen mostrando la pose deseada del personaje',
      genderLabel: 'Género del Personaje',
      female: 'Femenino',
      male: 'Masculino',
      genderDescription: 'Selecciona el género para tu personaje generado',
      bodyTypeLabel: 'Tipo de Cuerpo',
      femaleBody: 'Femenino',
      maleBody: 'Masculino',
      bodyTypeDescription: 'Elige el tipo de cuerpo para tu personaje'
    },
    physicalOptions: {
      gender: 'Género / Rasgos',
      ageRange: 'Rango de Edad',
      bodyType: 'Tipo de Cuerpo',
      muscleDefinition: 'Definición Muscular',
      height: 'Estatura',
      clothing: 'Vestimenta',
      poseAction: 'Acción / Pose'
    },
    bodyTypes: {
      athletic: '💪 Atlético',
      slim: '🏃 Delgado',
      average: '🧍 Promedio',
      robust: '🏋️ Robusto',
      curvy: '💃 Curvilíneo',
      muscular: '🦾 Musculoso'
    },
    muscles: {
      defined: '💎 Músculos Definidos',
      toned: '⚡ Tonificado',
      normal: '➖ Normal'
    },
    heights: {
      tall: '📏 Alto',
      average: '📐 Estatura Promedio',
      short: '📌 Bajo'
    },
    clothing: {
      sport: '⚽ Ropa Deportiva',
      casual: '👕 Casual',
      formal: '👔 Formal',
      swimsuit: '🩱 Traje de Baño',
      superhero: '🦸 Superhéroe',
      elegant: '🎩 Elegante de Gala',
      streetwear: '🧥 Streetwear'
    },
    poses: {
      standing: '🧍 De Pie/Parado',
      sitting: '🪑 Sentado',
      lying: '🛋️ Echado/Acostado',
      selfie: '🤳 Tomando Selfie',
      running: '🏃 Corriendo',
      jumping: '🦘 Saltando',
      powerPose: '💪 Pose de Poder',
      crossedArms: '🙅 Brazos Cruzados',
      meditating: '🧘 Meditando',
      dancing: '💃 Bailando'
    },
    generate: {
      button: 'GENERAR IMAGEN GRATIS',
      generating: 'CREANDO TU IMAGEN...',
      uploadRequired: '⚠️ Sube una foto para continuar',
      descRequired: '⚠️ Describe qué quieres hacer con la foto'
    },
    benefits: {
      title: '✨ Regístrate y obtén:',
      freeImages: '3 Imágenes Gratis',
      freeDesc: 'Pack de bienvenida',
      saveCreations: 'Guardar Creaciones',
      saveDesc: 'Acceso desde cualquier lugar',
      inviteFriends: 'Invita Amigos',
      inviteDesc: '+3 créditos por invitación'
    },
    modal: {
      ready: '¡Tu imagen está lista!',
      subtitle: 'Regístrate gratis para guardarla y crear más imágenes increíbles',
      registerButton: 'Registrarse Gratis',
      haveAccount: 'Ya tengo cuenta',
      noCard: 'Sin tarjeta requerida • Cancela cuando quieras'
    }
  },
  auth: {
    login: {
      title: 'Iniciar Sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      button: 'Iniciar Sesión',
      noAccount: '¿No tienes cuenta?',
      signUp: 'Regístrate',
      welcome: 'Bienvenido de vuelta',
      subtitle: 'Continúa creando historias increíbles',
      orLoginWith: 'O inicia sesión con',
      google: 'Google',
      apple: 'Apple',
      creating: 'Iniciando sesión...'
    },
    register: {
      title: 'Crear Cuenta',
      username: 'Nombre de usuario',
      usernamePlaceholder: 'usuario123',
      email: 'Correo electrónico',
      emailPlaceholder: 'tu@email.com',
      password: 'Contraseña',
      passwordPlaceholder: 'Mínimo 8 caracteres',
      confirmPassword: 'Confirmar contraseña',
      confirmPasswordPlaceholder: 'Confirma tu contraseña',
      button: 'Crear Cuenta',
      creating: 'Creando cuenta...',
      haveAccount: '¿Ya tienes cuenta?',
      signIn: 'Inicia sesión',
      joinCommunity: 'Únete a la comunidad de creadores',
      acceptTerms: 'Acepto los',
      terms: 'términos y condiciones',
      and: 'y la',
      privacy: 'política de privacidad',
      orRegisterWith: 'O regístrate con',
      referralBonus: '¡Bonus de invitación!',
      referralDesc: 'Obtendrás +3 imágenes gratis adicionales al registrarte',
      errorPasswordMismatch: 'Las contraseñas no coinciden',
      errorAcceptTerms: 'Debes aceptar los términos y condiciones',
      footer: '© 2026 DreamDuel. Todos los derechos reservados.'
    }
  },
  legal: {
    terms: {
      title: 'Términos y Condiciones',
      lastUpdated: 'Última actualización',
      contact: 'Contacto',
      section1: {
        title: 'Aceptación de los Términos',
        content: 'Al acceder y utilizar DreamDuel, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no deberás utilizar nuestro servicio.'
      },
      section2: {
        title: 'Descripción del Servicio',
        content: 'DreamDuel es una plataforma que permite a los usuarios crear, compartir y descubrir historias visuales generadas mediante inteligencia artificial. Nos reservamos el derecho de modificar o discontinuar el servicio en cualquier momento.'
      },
      section3: {
        title: 'Cuenta de Usuario',
        content: 'Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Aceptas la responsabilidad de todas las actividades que ocurran bajo tu cuenta. Debes ser mayor de 13 años para usar este servicio.'
      },
      section4: {
        title: 'Contenido del Usuario',
        content: 'Conservas todos los derechos sobre el contenido que crees en DreamDuel. Al publicar contenido, nos otorgas una licencia no exclusiva, mundial y libre de regalías para usar, mostrar y distribuir tu contenido en la plataforma.'
      },
      section5: {
        title: 'Conducta Prohibida',
        content: 'No debes usar DreamDuel para crear, publicar o compartir contenido ilegal, ofensivo, acosador, violento o que infrinja los derechos de terceros. Nos reservamos el derecho de eliminar contenido y suspender cuentas que violen estos términos.'
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
      lastUpdated: 'Última actualización',
      contact: 'Contacto',
      section1: {
        title: 'Información que Recopilamos',
        content: 'Recopilamos información que nos proporcionas directamente, como tu nombre, correo electrónico, y el contenido que creas. También recopilamos información automáticamente sobre tu uso del servicio, incluyendo dirección IP, tipo de navegador y páginas visitadas.'
      },
      section2: {
        title: 'Uso de la Información',
        content: 'Utilizamos tu información para proporcionar, mantener y mejorar nuestros servicios, procesar transacciones, enviarte comunicaciones, personalizar tu experiencia y proteger la seguridad de la plataforma.'
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
