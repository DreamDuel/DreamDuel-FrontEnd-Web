# PROMPT PARA DESARROLLO DE BACKEND - DREAMDUEL

## 📋 DESCRIPCIÓN DEL PROYECTO

Desarrollar un backend completo en Python para **DreamDuel**, una plataforma web de creación y compartición de historias visuales generadas con IA. La aplicación permite a los usuarios crear historias personalizadas con imágenes generadas por IA, interactuar con contenido de otros usuarios, y acceder a funcionalidades premium mediante suscripción.

---

## 🛠️ STACK TECNOLÓGICO REQUERIDO

### Framework Principal
- **FastAPI** (Python 3.11+)
- **Pydantic** para validación de datos
- **SQLAlchemy** como ORM

### Base de Datos
- **PostgreSQL** (primaria)
- **Redis** (caché y sesiones)

### Autenticación
- **JWT tokens** (access + refresh)
- **OAuth 2.0** (Google y Apple Sign-In)
- **bcrypt** para hashing de contraseñas

### Pagos
- **Stripe SDK** para suscripciones y pagos

### Storage
- **Cloudinary** para almacenamiento de imágenes
- CDN global incluido
- Optimización automática (WebP, compresión, resize)
- URLs firmadas y transformaciones on-the-fly

### Email
- **Resend** para emails transaccionales
- Templates modernos
- Excelente deliverability

### Infraestructura
- **Railway** como plataforma de hosting (PaaS)
- **Docker** y **Docker Compose**
- **Gunicorn + Uvicorn** para producción
- PostgreSQL y Redis managed (incluidos en Railway)

### Testing
- **pytest** para testing
- **pytest-asyncio** para tests asíncronos

---

## 🏗️ ARQUITECTURA

### Patrón: DDD (Domain-Driven Design) + Clean Architecture

**Principios DDD aplicados:**
- ✅ Agregados (Aggregates) con raíces y consistencia
- ✅ Entidades (Entities) con identidad única
- ✅ Objetos de Valor (Value Objects) inmutables
- ✅ Servicios de Dominio (Domain Services) para lógica de negocio
- ✅ Repositorios (Repositories) como abstracciones
- ✅ Eventos de Dominio (Domain Events) para desacoplamiento
- ✅ Lenguaje Ubicuo (Ubiquitous Language) consistente

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                              # FastAPI app
│   │
│   ├── core/
│   │   ├── config.py                        # Configuración (env vars)
│   │   ├── security.py                      # JWT, hashing, etc.
│   │   ├── dependencies.py                  # Dependency injection
│   │   └── exceptions.py                    # Custom exceptions
│   │
│   ├── domain/                              # ⭐ CAPA DE DOMINIO (DDD)
│   │   │
│   │   ├── aggregates/                      # Agregados (raíces)
│   │   │   ├── __init__.py
│   │   │   ├── story.py                     # Story Aggregate (Story + Scenes + Characters)
│   │   │   ├── user.py                      # User Aggregate (User + Stats + Credits)
│   │   │   └── subscription.py              # Subscription Aggregate
│   │   │
│   │   ├── entities/                        # Entidades con identidad
│   │   │   ├── __init__.py
│   │   │   ├── scene.py                     # Escena de historia
│   │   │   ├── character.py                 # Personaje
│   │   │   ├── comment.py                   # Comentario
│   │   │   └── like.py                      # Like
│   │   │
│   │   ├── value_objects/                   # Objetos de valor inmutables
│   │   │   ├── __init__.py
│   │   │   ├── email.py                     # Email (validación)
│   │   │   ├── story_stats.py               # Estadísticas de historia
│   │   │   ├── user_stats.py                # Estadísticas de usuario
│   │   │   ├── credits.py                   # Créditos del usuario
│   │   │   ├── visual_style.py              # Estilo visual (enum)
│   │   │   └── story_creation_request.py    # Request de creación
│   │   │
│   │   ├── repositories/                    # Interfaces (puertos)
│   │   │   ├── __init__.py
│   │   │   ├── story_repository.py          # IStoryRepository
│   │   │   ├── user_repository.py           # IUserRepository
│   │   │   ├── comment_repository.py        # ICommentRepository
│   │   │   └── subscription_repository.py   # ISubscriptionRepository
│   │   │
│   │   ├── services/                        # Servicios de dominio (lógica compleja)
│   │   │   ├── __init__.py
│   │   │   ├── credit_service.py            # Gestión de créditos
│   │   │   ├── story_generation_service.py  # Orquestación de generación
│   │   │   ├── subscription_service.py      # Lógica de suscripciones
│   │   │   └── analytics_service.py         # Cálculo de métricas
│   │   │
│   │   ├── events/                          # Eventos de dominio
│   │   │   ├── __init__.py
│   │   │   ├── story_created.py
│   │   │   ├── user_upgraded.py
│   │   │   ├── credit_consumed.py
│   │   │   └── story_liked.py
│   │   │
│   │   └── exceptions/                      # Excepciones de dominio
│   │       ├── __init__.py
│   │       ├── story_exceptions.py
│   │       ├── user_exceptions.py
│   │       └── credit_exceptions.py
│   │
│   ├── application/                         # ⭐ CAPA DE APLICACIÓN (Use Cases)
│   │   ├── use_cases/
│   │   │   ├── auth/
│   │   │   │   ├── login.py
│   │   │   │   ├── register.py
│   │   │   │   └── refresh_token.py
│   │   │   ├── stories/
│   │   │   │   ├── create_story.py
│   │   │   │   ├── get_stories.py
│   │   │   │   ├── like_story.py
│   │   │   │   └── search_stories.py
│   │   │   ├── users/
│   │   │   │   ├── get_profile.py
│   │   │   │   ├── update_profile.py
│   │   │   │   └── follow_user.py
│   │   │   └── payments/
│   │   │       ├── create_subscription.py
│   │   │       └── cancel_subscription.py
│   │   │
│   │   └── dto/                             # Data Transfer Objects
│   │       ├── story_dto.py
│   │       ├── user_dto.py
│   │       └── comment_dto.py
│   │
│   ├── infrastructure/                      # ⭐ CAPA DE INFRAESTRUCTURA
│   │   │
│   │   ├── database/
│   │   │   ├── models.py                    # SQLAlchemy ORM models
│   │   │   ├── session.py                   # DB session management
│   │   │   └── unit_of_work.py              # Unit of Work pattern
│   │   │
│   │   ├── repositories/                    # Implementaciones concretas
│   │   │   ├── sqlalchemy_story_repository.py
│   │   │   ├── sqlalchemy_user_repository.py
│   │   │   ├── sqlalchemy_comment_repository.py
│   │   │   └── sqlalchemy_subscription_repository.py
│   │   │
│   │   ├── external_services/               # Servicios externos (adaptadores)
│   │   │   ├── stripe_service.py
│   │   │   ├── cloudinary_service.py
│   │   │   ├── resend_service.py
│   │   │   ├── ai_image_service.py          # [PLACEHOLDER - GENERADOR IA]
│   │   │   └── ai_story_service.py          # [PLACEHOLDER - GENERADOR IA]
│   │   │
│   │   ├── cache/
│   │   │   └── redis_client.py
│   │   │
│   │   └── messaging/                       # Event bus (opcional)
│   │       └── event_publisher.py
│   │
│   ├── api/                                 # ⭐ CAPA DE PRESENTACIÓN
│   │   ├── v1/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   ├── stories.py
│   │   │   │   ├── comments.py
│   │   │   │   ├── payments.py
│   │   │   │   ├── analytics.py
│   │   │   │   ├── upload.py
│   │   │   │   └── generate.py              # [PLACEHOLDER - ENDPOINTS IA]
│   │   │   │
│   │   │   ├── schemas/                     # Pydantic schemas (contratos API)
│   │   │   │   ├── auth.py
│   │   │   │   ├── user.py
│   │   │   │   ├── story.py
│   │   │   │   ├── comment.py
│   │   │   │   └── payment.py
│   │   │   │
│   │   │   ├── dependencies.py              # FastAPI dependencies
│   │   │   └── middleware.py                # Auth, logging, etc.
│   │   │
│   │   └── router.py
│   │
│   └── utils/                               # Utilidades compartidas
│       ├── pagination.py
│       ├── validators.py
│       └── helpers.py
│
├── tests/                                   # Tests organizados por capa
│   ├── unit/
│   │   ├── domain/
│   │   └── application/
│   ├── integration/
│   └── e2e/
├── migrations/                      # Alembic migrations
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── .env.example
```

---

## 🎨 CONCEPTOS DDD APLICADOS A DREAMDUEL

### 1. Agregados (Aggregates)

Los agregados garantizan consistencia transaccional y encapsulan reglas de negocio.

#### **Story Aggregate** (Raíz: Story)
```python
# domain/aggregates/story.py

class Story:
    """Agregado Story - Raíz del agregado"""
    
    def __init__(self, id: UUID, title: str, author_id: UUID):
        self.id = id
        self.title = title
        self.author_id = author_id
        self._scenes: List[Scene] = []  # Entities dentro del agregado
        self._characters: List[Character] = []
        self.stats = StoryStats()  # Value Object
        self.visibility = Visibility.PUBLIC
        self._domain_events: List[DomainEvent] = []
    
    def add_scene(self, scene: Scene) -> None:
        """Regla de negocio: máximo 10 escenas"""
        if len(self._scenes) >= 10:
            raise MaxScenesExceededError("Maximum 10 scenes per story")
        self._scenes.append(scene)
    
    def like_by(self, user_id: UUID) -> None:
        """Incrementa like y registra evento de dominio"""
        self.stats = self.stats.increment_likes()
        self._domain_events.append(StoryLikedEvent(self.id, user_id))
    
    def can_be_edited_by(self, user_id: UUID) -> bool:
        """Lógica de dominio: solo el autor puede editar"""
        return self.author_id == user_id
    
    @property
    def domain_events(self) -> List[DomainEvent]:
        return self._domain_events.copy()
    
    def clear_domain_events(self) -> None:
        self._domain_events.clear()
```

#### **User Aggregate** (Raíz: User)
```python
# domain/aggregates/user.py

class User:
    """Agregado User - Raíz del agregado"""
    
    def __init__(self, id: UUID, email: Email, username: str):
        self.id = id
        self.email = email  # Value Object
        self.username = username
        self.stats = UserStats()  # Value Object
        self.credits = Credits(free_left=10)  # Value Object
        self.is_premium = False
        self._domain_events: List[DomainEvent] = []
    
    def consume_credit(self) -> None:
        """Regla de negocio: verificar créditos antes de generar"""
        if self.is_premium:
            return  # Premium tiene ilimitado
        
        if not self.credits.has_available():
            raise InsufficientCreditsError("No credits left")
        
        self.credits = self.credits.decrement()
        self._domain_events.append(CreditConsumedEvent(self.id))
    
    def upgrade_to_premium(self, subscription_id: UUID) -> None:
        """Actualiza a premium y registra evento"""
        self.is_premium = True
        self._domain_events.append(UserUpgradedEvent(self.id, subscription_id))
    
    def apply_referral_bonus(self) -> None:
        """Aplica bonus de referral"""
        self.credits = self.credits.add(5)
        self._domain_events.append(ReferralBonusAppliedEvent(self.id))
```

### 2. Value Objects (Objetos de Valor)

Inmutables, sin identidad, comparables por valor.

```python
# domain/value_objects/credits.py

@dataclass(frozen=True)
class Credits:
    """Value Object: Créditos del usuario"""
    free_left: int
    reset_at: datetime = field(default_factory=lambda: datetime.now() + timedelta(days=30))
    
    def has_available(self) -> bool:
        if self.is_expired():
            return False
        return self.free_left > 0
    
    def is_expired(self) -> bool:
        return datetime.now() > self.reset_at
    
    def decrement(self) -> 'Credits':
        """Retorna nuevo objeto (inmutable)"""
        if self.free_left <= 0:
            raise ValueError("No credits left")
        return Credits(
            free_left=self.free_left - 1,
            reset_at=self.reset_at
        )
    
    def add(self, amount: int) -> 'Credits':
        return Credits(
            free_left=self.free_left + amount,
            reset_at=self.reset_at
        )

# domain/value_objects/email.py

@dataclass(frozen=True)
class Email:
    """Value Object: Email con validación"""
    value: str
    
    def __post_init__(self):
        if not self._is_valid():
            raise InvalidEmailError(f"Invalid email: {self.value}")
    
    def _is_valid(self) -> bool:
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        return re.match(pattern, self.value) is not None

# domain/value_objects/story_stats.py

@dataclass(frozen=True)
class StoryStats:
    """Value Object: Estadísticas de historia"""
    views: int = 0
    likes: int = 0
    comments: int = 0
    saves: int = 0
    
    def increment_views(self) -> 'StoryStats':
        return replace(self, views=self.views + 1)
    
    def increment_likes(self) -> 'StoryStats':
        return replace(self, likes=self.likes + 1)
```

### 3. Domain Services (Servicios de Dominio)

Lógica de negocio que no pertenece a una entidad específica.

```python
# domain/services/credit_service.py

class CreditService:
    """Servicio de dominio: lógica de créditos"""
    
    def calculate_generation_cost(
        self,
        user: User,
        scene_count: int
    ) -> int:
        """Calcula el costo en créditos de una generación"""
        if user.is_premium:
            return 0
        
        # 1 crédito por imagen
        return scene_count
    
    def can_generate(
        self,
        user: User,
        scene_count: int
    ) -> bool:
        """Verifica si el usuario puede generar"""
        if user.is_premium:
            return True
        
        cost = self.calculate_generation_cost(user, scene_count)
        return user.credits.free_left >= cost

# domain/services/story_generation_service.py

class StoryGenerationService:
    """Servicio de dominio: orquestación de generación de historias"""
    
    def __init__(self, credit_service: CreditService):
        self.credit_service = credit_service
    
    async def validate_generation_request(
        self,
        user: User,
        request: StoryCreationRequest
    ) -> None:
        """Valida que la generación sea posible"""
        
        # Validar créditos
        if not self.credit_service.can_generate(user, len(request.scenes)):
            raise InsufficientCreditsError()
        
        # Validar límites
        if len(request.scenes) > 10:
            raise MaxScenesExceededError()
        
        # Validar rate limits
        # ... más validaciones de dominio
```

### 4. Domain Events (Eventos de Dominio)

Notificaciones de cambios importantes en el dominio.

```python
# domain/events/__init__.py

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

@dataclass(frozen=True)
class DomainEvent:
    """Base para eventos de dominio"""
    occurred_at: datetime = field(default_factory=datetime.now)

# domain/events/story_created.py

@dataclass(frozen=True)
class StoryCreatedEvent(DomainEvent):
    story_id: UUID
    author_id: UUID
    title: str

# domain/events/credit_consumed.py

@dataclass(frozen=True)
class CreditConsumedEvent(DomainEvent):
    user_id: UUID
    credits_left: int

# domain/events/user_upgraded.py

@dataclass(frozen=True)
class UserUpgradedEvent(DomainEvent):
    user_id: UUID
    subscription_id: UUID
```

### 5. Repositories (Interfaces)

Abstracción para persistencia de agregados.

```python
# domain/repositories/story_repository.py

from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID

class IStoryRepository(ABC):
    """Interfaz del repositorio (puerto)"""
    
    @abstractmethod
    async def find_by_id(self, story_id: UUID) -> Optional[Story]:
        """Encuentra historia por ID"""
        pass
    
    @abstractmethod
    async def save(self, story: Story) -> Story:
        """Guarda o actualiza historia"""
        pass
    
    @abstractmethod
    async def delete(self, story_id: UUID) -> None:
        """Elimina historia"""
        pass
    
    @abstractmethod
    async def find_by_author(self, author_id: UUID) -> List[Story]:
        """Encuentra historias por autor"""
        pass
    
    @abstractmethod
    async def find_trending(self, limit: int = 20) -> List[Story]:
        """Encuentra historias trending"""
        pass

# infrastructure/repositories/sqlalchemy_story_repository.py

class SQLAlchemyStoryRepository(IStoryRepository):
    """Implementación concreta con SQLAlchemy"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def find_by_id(self, story_id: UUID) -> Optional[Story]:
        result = await self.session.execute(
            select(StoryModel).where(StoryModel.id == story_id)
        )
        story_model = result.scalar_one_or_none()
        
        if not story_model:
            return None
        
        # Mapear ORM model → Domain entity
        return self._to_domain(story_model)
    
    async def save(self, story: Story) -> Story:
        # Mapear Domain entity → ORM model
        story_model = self._to_orm(story)
        self.session.add(story_model)
        await self.session.commit()
        
        # Publicar eventos de dominio
        await self._publish_events(story.domain_events)
        story.clear_domain_events()
        
        return story
```

### 6. Use Cases (Application Layer)

Orquestación de lógica de aplicación.

```python
# application/use_cases/stories/create_story.py

class CreateStoryUseCase:
    """Caso de uso: crear historia"""
    
    def __init__(
        self,
        story_repository: IStoryRepository,
        user_repository: IUserRepository,
        generation_service: StoryGenerationService,
        credit_service: CreditService,
        ai_service: IAIStoryService,  # PLACEHOLDER
        unit_of_work: IUnitOfWork
    ):
        self.story_repo = story_repository
        self.user_repo = user_repository
        self.generation_service = generation_service
        self.credit_service = credit_service
        self.ai_service = ai_service
        self.uow = unit_of_work
    
    async def execute(
        self,
        user_id: UUID,
        request: StoryCreationRequest
    ) -> StoryDTO:
        """Ejecuta el caso de uso"""
        
        # 1. Obtener usuario
        user = await self.user_repo.find_by_id(user_id)
        if not user:
            raise UserNotFoundError()
        
        # 2. Validar con servicio de dominio
        await self.generation_service.validate_generation_request(user, request)
        
        # 3. Consumir créditos
        cost = self.credit_service.calculate_generation_cost(user, len(request.scenes))
        for _ in range(cost):
            user.consume_credit()
        
        # 4. Generar historia con IA [PLACEHOLDER]
        story_data = await self.ai_service.generate_story(request)
        
        # 5. Crear agregado Story
        story = Story.create(
            title=story_data.title,
            synopsis=story_data.synopsis,
            author_id=user_id,
            tags=request.tags
        )
        
        # 6. Persistir cambios (Unit of Work)
        async with self.uow:
            await self.user_repo.save(user)
            await self.story_repo.save(story)
            await self.uow.commit()
        
        # 7. Retornar DTO
        return StoryDTO.from_entity(story)
```

---

## 🏆 VENTAJAS DE DDD PARA DREAMDUEL

### ¿Por qué DDD es ideal para este proyecto?

**1. Lógica de Negocio Compleja**
- Sistema de créditos con reglas específicas (free vs premium)
- Generaciones de IA con validaciones y límites
- Suscripciones con estados y transiciones
- DDD encapsula toda esta complejidad en el dominio

**2. Consistencia del Frontend**
- Tu frontend ya usa conceptos de dominio (`domain/entities`, `domain/repositories`)
- Mismo lenguaje ubicuo en ambas capas (Story, User, Character, etc.)
- Fácil comunicación entre frontend y backend

**3. Escalabilidad y Mantenibilidad**
- Reglas de negocio centralizadas en agregados
- Fácil agregar nuevas features sin romper código existente
- Testing simplificado (unit tests de dominio puros)
- Separación clara de responsabilidades

**4. Eventos de Dominio = Features Futuras**
- `StoryCreatedEvent` → Notificaciones a seguidores
- `CreditConsumedEvent` → Analytics y métricas
- `UserUpgradedEvent` → Emails de bienvenida premium
- Fácil agregar background jobs sin tocar lógica core

**5. Testabilidad Máxima**
```python
# Tests de dominio puros (sin DB, sin mocks)
def test_user_consume_credit():
    user = User(id=uuid4(), email=Email("test@test.com"), username="test")
    user.credits = Credits(free_left=5)
    
    user.consume_credit()
    
    assert user.credits.free_left == 4

def test_insufficient_credits_raises_error():
    user = User(id=uuid4(), email=Email("test@test.com"), username="test")
    user.credits = Credits(free_left=0)
    
    with pytest.raises(InsufficientCreditsError):
        user.consume_credit()
```

### Bounded Contexts en DreamDuel

Para mantener el código organizado, identifica estos contextos:

1. **Identity & Access Context** - Autenticación, usuarios, permisos
2. **Story Creation Context** - Generación de historias, IA, personajes
3. **Social Context** - Likes, comentarios, follows, shares
4. **Billing Context** - Suscripciones, pagos, créditos
5. **Analytics Context** - Métricas, eventos, reportes

Cada contexto puede tener sus propios agregados y modelos.

---

## 📊 MODELOS DE BASE DE DATOS

### User
```python
- id: UUID (PK)
- username: String (unique, indexed)
- email: String (unique, indexed)
- password_hash: String
- avatar_url: String (nullable)
- bio: Text (nullable)
- is_premium: Boolean (default: False)
- is_verified: Boolean (default: False)
- referral_code: String (unique, indexed)
- referred_by_id: UUID (FK to users, nullable)
- free_images_left: Integer (default: 10)
- free_images_reset_at: DateTime
- created_at: DateTime
- updated_at: DateTime
```

### Story
```python
- id: UUID (PK)
- title: String
- synopsis: Text
- cover_url: String
- author_id: UUID (FK to users, indexed)
- visibility: Enum ('public', 'private')
- tags: JSON/Array[String]
- visual_style: String
- intensity: Float
- views: Integer (default: 0)
- likes: Integer (default: 0)
- comments_count: Integer (default: 0)
- saves: Integer (default: 0)
- created_at: DateTime (indexed)
- updated_at: DateTime
```

### Scene
```python
- id: UUID (PK)
- story_id: UUID (FK to stories, indexed)
- image_url: String
- text: Text
- order: Integer
- generation_id: String (nullable) # Referencia a generación de IA
- created_at: DateTime
```

### Character
```python
- id: UUID (PK)
- story_id: UUID (FK to stories, indexed)
- name: String
- photo_url: String (nullable)
- description: Text (nullable)
- created_at: DateTime
```

### Comment
```python
- id: UUID (PK)
- story_id: UUID (FK to stories, indexed)
- user_id: UUID (FK to users, indexed)
- parent_id: UUID (FK to comments, nullable) # Para replies
- content: Text
- likes: Integer (default: 0)
- created_at: DateTime
- updated_at: DateTime
```

### Like (tabla relacional)
```python
- id: UUID (PK)
- user_id: UUID (FK to users, indexed)
- story_id: UUID (FK to stories, nullable)
- comment_id: UUID (FK to comments, nullable)
- created_at: DateTime
- UNIQUE CONSTRAINT (user_id, story_id)
- UNIQUE CONSTRAINT (user_id, comment_id)
```

### Save (historias guardadas)
```python
- id: UUID (PK)
- user_id: UUID (FK to users, indexed)
- story_id: UUID (FK to stories, indexed)
- created_at: DateTime
- UNIQUE CONSTRAINT (user_id, story_id)
```

### Follow
```python
- id: UUID (PK)
- follower_id: UUID (FK to users, indexed)
- following_id: UUID (FK to users, indexed)
- created_at: DateTime
- UNIQUE CONSTRAINT (follower_id, following_id)
```

### Subscription
```python
- id: UUID (PK)
- user_id: UUID (FK to users, unique)
- stripe_customer_id: String (unique)
- stripe_subscription_id: String (unique)
- plan_id: String
- status: Enum ('active', 'canceled', 'past_due', 'incomplete')
- current_period_start: DateTime
- current_period_end: DateTime
- cancel_at_period_end: Boolean
- created_at: DateTime
- updated_at: DateTime
```

### Invoice
```python
- id: UUID (PK)
- user_id: UUID (FK to users, indexed)
- stripe_invoice_id: String (unique)
- amount: Integer (centavos)
- status: String
- invoice_url: String
- created_at: DateTime
```

### AnalyticsEvent
```python
- id: UUID (PK)
- user_id: UUID (FK to users, nullable, indexed)
- event_type: String (indexed)
- metadata: JSON
- created_at: DateTime (indexed)
```

### Report (reportes de contenido)
```python
- id: UUID (PK)
- reporter_id: UUID (FK to users, indexed)
- story_id: UUID (FK to stories, nullable)
- comment_id: UUID (FK to comments, nullable)
- reason: Text
- status: Enum ('pending', 'reviewed', 'resolved')
- created_at: DateTime
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Endpoints de Auth

#### POST /api/auth/register
```python
Body: {
    "username": str,
    "email": str,
    "password": str,
    "referral_code": str (opcional)
}
Response: {
    "token": str,
    "user": UserSchema
}
```

#### POST /api/auth/login
```python
Body: {
    "emailOrUsername": str,
    "password": str
}
Response: {
    "token": str,
    "user": UserSchema
}
```

#### POST /api/auth/logout
```python
Headers: Authorization Bearer {token}
Response: { "success": true }
```

#### POST /api/auth/refresh
```python
Body: { "refresh_token": str }
Response: { "token": str, "user": UserSchema }
```

#### POST /api/auth/google
```python
Body: { "token": str } # Google OAuth token
Response: { "token": str, "user": UserSchema }
```

#### POST /api/auth/apple
```python
Body: { "token": str } # Apple OAuth token
Response: { "token": str, "user": UserSchema }
```

#### POST /api/auth/password-reset
```python
Body: { "email": str }
Response: { "message": "Email sent" }
# Envía email con token de reseteo
```

#### POST /api/auth/password-reset/confirm
```python
Body: {
    "token": str,
    "newPassword": str
}
Response: { "message": "Password updated" }
```

#### POST /api/auth/verify-email
```python
Body: { "token": str }
Response: { "message": "Email verified" }
```

### Seguridad
- Passwords hasheados con **bcrypt** (cost factor: 12)
- JWT con expiración (access: 1h, refresh: 30 días)
- Rate limiting en endpoints sensibles
- CORS configurado para dominios permitidos
- Validación de tokens en middleware

---

## 👤 ENDPOINTS DE USUARIOS

### GET /api/users/me
```python
Headers: Authorization Bearer {token}
Response: UserProfileSchema
```

### GET /api/users/{user_id}
```python
Response: PublicUserProfileSchema
```

### PUT /api/users/{user_id}
```python
Headers: Authorization Bearer {token}
Body: {
    "username": str (opcional),
    "bio": str (opcional),
    "avatarUrl": str (opcional)
}
Response: UserProfileSchema
```

### PUT /api/users/{user_id}/avatar
```python
Headers: Authorization Bearer {token}
Body: { "avatarUrl": str }
Response: UserProfileSchema
```

### POST /api/users/{user_id}/follow
```python
Headers: Authorization Bearer {token}
Response: {
    "following": bool,
    "followersCount": int
}
```

### POST /api/users/{user_id}/unfollow
```python
Headers: Authorization Bearer {token}
Response: {
    "following": bool,
    "followersCount": int
}
```

### GET /api/users/{user_id}/followers
```python
Response: List[PublicUserProfileSchema]
```

### GET /api/users/{user_id}/following
```python
Response: List[PublicUserProfileSchema]
```

### GET /api/users/me/credits
```python
Headers: Authorization Bearer {token}
Response: {
    "freeImagesLeft": int,
    "resetAt": datetime
}
```

### POST /api/users/me/credits/use
```python
Headers: Authorization Bearer {token}
Response: {
    "success": bool,
    "creditsLeft": int
}
```

### POST /api/users/me/referral/apply
```python
Headers: Authorization Bearer {token}
Body: { "code": str }
Response: {
    "success": bool,
    "bonusCredits": int
}
```

---

## 📚 ENDPOINTS DE HISTORIAS

### GET /api/stories
```python
Query params: 
    - page: int (default: 1)
    - limit: int (default: 20)
Response: {
    "items": List[StorySchema],
    "total": int,
    "page": int,
    "pages": int
}
```

### GET /api/stories/trending
```python
Query params: page, limit
Response: PaginatedStories
# Ordenadas por likes/views en últimos 7 días
```

### GET /api/stories/new
```python
Query params: page, limit
Response: PaginatedStories
# Ordenadas por created_at DESC
```

### GET /api/stories/{story_id}
```python
Response: StoryDetailSchema (incluye scenes, characters)
```

### GET /api/stories/author/{author_id}
```python
Query params: page, limit
Response: PaginatedStories
```

### GET /api/stories/search
```python
Query params:
    - q: str (query)
    - tags: str (comma-separated)
    - style: str (visual style)
    - sort: str (trending, new, popular)
    - page: int
    - limit: int
Response: PaginatedStories
```

### POST /api/stories
```python
Headers: Authorization Bearer {token}
Body: {
    "prompt": str,
    "tags": List[str],
    "intensity": float,
    "visualStyle": str,
    "isPublic": bool,
    "characters": List[CharacterInput]
}
Response: StorySchema
# Este endpoint debe coordinar con el generador de IA
# [INTEGRACIÓN CON GENERADOR DE HISTORIAS E IMÁGENES]
```

### PUT /api/stories/{story_id}
```python
Headers: Authorization Bearer {token}
Body: Partial[StoryUpdateSchema]
Response: StorySchema
```

### DELETE /api/stories/{story_id}
```python
Headers: Authorization Bearer {token}
Response: { "success": true }
```

### POST /api/stories/{story_id}/view
```python
Response: { "success": true }
# Incrementa contador de vistas
```

### POST /api/stories/{story_id}/like
```python
Headers: Authorization Bearer {token}
Body: { "userId": str }
Response: { "liked": bool, "likesCount": int }
```

### POST /api/stories/{story_id}/save
```python
Headers: Authorization Bearer {token}
Body: { "userId": str }
Response: { "saved": bool }
```

---

## 💬 ENDPOINTS DE COMENTARIOS

### GET /api/comments/story/{story_id}
```python
Response: List[CommentSchema]
# Incluye replies anidados
```

### POST /api/comments
```python
Headers: Authorization Bearer {token}
Body: {
    "storyId": str,
    "content": str,
    "parentId": str (opcional)
}
Response: CommentSchema
```

### PUT /api/comments/{comment_id}
```python
Headers: Authorization Bearer {token}
Body: { "content": str }
Response: CommentSchema
```

### DELETE /api/comments/{comment_id}
```python
Headers: Authorization Bearer {token}
Response: { "success": true }
```

### POST /api/comments/{comment_id}/like
```python
Headers: Authorization Bearer {token}
Response: {
    "liked": bool,
    "likesCount": int
}
```

### POST /api/comments/{comment_id}/report
```python
Headers: Authorization Bearer {token}
Body: { "reason": str }
Response: { "success": true }
```

---

## 💳 ENDPOINTS DE PAGOS (STRIPE)

### GET /api/payments/plans
```python
Response: List[SubscriptionPlanSchema]
```

### POST /api/payments/subscribe
```python
Headers: Authorization Bearer {token}
Body: { "planId": str }
Response: {
    "clientSecret": str,
    "subscriptionId": str
}
# Crea Stripe Customer si no existe
# Crea Stripe Subscription
```

### GET /api/payments/subscription/status
```python
Headers: Authorization Bearer {token}
Response: {
    "active": bool,
    "plan": str,
    "currentPeriodEnd": datetime,
    "cancelAtPeriodEnd": bool
}
```

### POST /api/payments/subscription/cancel
```python
Headers: Authorization Bearer {token}
Response: { "success": true }
# No cancela inmediatamente, marca cancel_at_period_end
```

### POST /api/payments/subscription/reactivate
```python
Headers: Authorization Bearer {token}
Response: { "success": true }
```

### POST /api/payments/payment-method
```python
Headers: Authorization Bearer {token}
Body: { "paymentMethodId": str }
Response: { "success": true }
```

### GET /api/payments/invoices
```python
Headers: Authorization Bearer {token}
Response: List[InvoiceSchema]
```

### POST /api/payments/portal
```python
Headers: Authorization Bearer {token}
Response: { "url": str }
# URL del Stripe Customer Portal
```

### POST /api/webhooks/stripe
```python
# Webhook para eventos de Stripe
# Events: invoice.paid, customer.subscription.updated, etc.
```

---

## 📤 ENDPOINTS DE UPLOAD

### POST /api/upload
```python
Headers: Authorization Bearer {token}
Content-Type: multipart/form-data
Body: {
    file: File,
    folder: str (stories | avatars | characters)
}
Response: { 
    "url": str,  # URL pública de Cloudinary con CDN
    "publicId": str,  # ID de Cloudinary para transformaciones
    "width": int,
    "height": int,
    "format": str
}
# Sube a Cloudinary con:
# - Optimización automática (WebP/AVIF)
# - Compresión inteligente
# - CDN global
# - Validación de tipo MIME y tamaño
# - Generación de thumbnails automática
```

---

## 🤖 ENDPOINTS DE GENERACIÓN IA

### [PLACEHOLDER - GENERADOR DE IMÁGENES]

### POST /api/generate
```python
Headers: Authorization Bearer {token}
Body: {
    "prompt": str,
    "style": str (opcional),
    "aspectRatio": str (opcional),
    "negativePrompt": str (opcional),
    "characterImages": List[str] (opcional)
}
Response: {
    "imageUrl": str,
    "prompt": str,
    "generationId": str,
    "creditsUsed": int
}

# PLACEHOLDER: Aquí se integrará con el servicio de generación de imágenes IA
# Opciones: Stable Diffusion, DALL-E, Midjourney API, Replicate, etc.
# Debe verificar créditos del usuario antes de generar
# Debe guardar registro de generación en BD
```

### POST /api/generate/batch
```python
Headers: Authorization Bearer {token}
Body: {
    "scenes": List[{
        "text": str,
        "prompt": str
    }],
    "style": str,
    "characterImages": List[str] (opcional)
}
Response: {
    "images": List[{
        "sceneIndex": int,
        "imageUrl": str,
        "generationId": str
    }],
    "totalCreditsUsed": int
}

# PLACEHOLDER: Generación batch para historias completas
# Debe ser asíncrono (usar Celery o similar)
# Opcionalmente retornar task_id para polling de estado
```

### POST /api/generate/{generation_id}/regenerate
```python
Headers: Authorization Bearer {token}
Body: { "prompt": str (opcional) }
Response: GenerationResponse

# PLACEHOLDER: Regenera una imagen con mismo o nuevo prompt
```

### GET /api/generate/{generation_id}/status
```python
Headers: Authorization Bearer {token}
Response: {
    "status": str (pending | processing | completed | failed),
    "imageUrl": str (opcional),
    "error": str (opcional)
}

# PLACEHOLDER: Para generaciones asíncronas
```

### POST /api/generate/{generation_id}/cancel
```python
Headers: Authorization Bearer {token}
Response: { "success": true }

# PLACEHOLDER: Cancela generación en progreso
```

---

### [PLACEHOLDER - GENERADOR DE HISTORIAS]

### POST /api/generate/story
```python
Headers: Authorization Bearer {token}
Body: {
    "prompt": str,
    "tags": List[str],
    "intensity": float,
    "characters": List[CharacterInput]
}
Response: {
    "title": str,
    "synopsis": str,
    "scenes": List[{
        "text": str,
        "imagePrompt": str
    }]
}

# PLACEHOLDER: Genera estructura de historia usando IA (GPT-4, Claude, etc.)
# Este endpoint se llama ANTES de generar las imágenes
# Opciones: OpenAI GPT-4, Anthropic Claude, Llama, etc.
```

---

## 📊 ENDPOINTS DE ANALYTICS

### POST /api/analytics/event
```python
Headers: Authorization Bearer {token} (opcional)
Body: {
    "eventType": str,
    "metadata": dict
}
Response: { "success": true }
# Event types: page_view, story_view, story_create, blur_click, 
# download_attempt, premium_click, referral_click
```

### GET /api/analytics/user/metrics
```python
Headers: Authorization Bearer {token}
Response: {
    "generationsToday": int,
    "blurClicksToday": int,
    "downloadAttempts": int,
    "storiesViewed": int,
    "isHighIntent": bool
}
```

### GET /api/analytics/story/{story_id}
```python
Headers: Authorization Bearer {token}
Response: {
    "storyId": str,
    "views": int,
    "likes": int,
    "saves": int,
    "comments": int,
    "shares": int,
    "averageReadTime": float,
    "completionRate": float
}
```

---

## ⚙️ FEATURES ADICIONALES REQUERIDAS

### 1. Sistema de Créditos
- Usuarios gratuitos: 10 imágenes/mes
- Reset mensual automático
- Al usar referral: +5 imágenes extra
- Premium: ilimitado

### 2. Rate Limiting
- Límites por IP y por usuario
- Endpoints críticos: 100 req/min
- Generación de IA: 10 req/min (usuarios free), ilimitado (premium)

### 3. Caché con Redis
- Cachear trending stories (5 min TTL)
- Cachear user profiles (10 min TTL)
- Session storage

### 4. Background Jobs (Celery)
- Generación de imágenes en batch
- Envío de emails
- Procesamiento de analytics
- Limpieza de archivos temporales

### 5. Logging y Monitoring
- Structured logging (JSON)
- Error tracking (Sentry)
- Performance monitoring (APM)

### 6. Validaciones
- Pydantic schemas estrictos
- Validación de imágenes (tipo, tamaño)
- Sanitización de inputs (prevenir XSS/SQL injection)

### 7. Paginación
- Cursor-based para feeds
- Page-based para búsquedas
- Default: 20 items/página

### 8. Soft Deletes
- No borrar físicamente stories/comments
- Campo `deleted_at`
- Filtrar en queries

### 9. Search Optimizado
- Full-text search en PostgreSQL (tsvector)
- Opcionalmente: ElasticSearch para búsquedas avanzadas

### 10. Health Checks
- GET /health → { "status": "ok", "db": "ok", "redis": "ok" }
- GET /metrics → Prometheus metrics

---

## 🔒 SEGURIDAD

1. **HTTPS obligatorio en producción**
2. **SQL Injection**: usar ORM (SQLAlchemy)
3. **XSS**: sanitizar inputs
4. **CSRF**: tokens en formularios
5. **Rate limiting**: Redis + middleware
6. **Secrets**: usar variables de entorno
7. **Content Security Policy**: headers apropiados
8. **Input validation**: Pydantic estricto
9. **File uploads**: validar tipo MIME, tamaño máximo
10. **JWT**: firmar con secret fuerte, expiración corta

---

## 📁 CONFIGURACIÓN RÁPIDA (.env para desarrollo local)

```env
# App
APP_NAME=DreamDuel
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production-min-32-chars
API_V1_PREFIX=/api

# Database (Local - Railway proporciona DATABASE_URL en producción)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dreamduel_dev
REDIS_URL=redis://localhost:6379/0

# Auth
JWT_SECRET=dev-jwt-secret-change-in-prod-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# OAuth Google (obtener en https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your-app.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret

# OAuth Apple (obtener en https://developer.apple.com)
APPLE_CLIENT_ID=com.dreamduel.signin
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----

# Stripe (obtener en https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_51xxxxx  # Usar sk_test_ en desarrollo
STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_MONTHLY_PRICE_ID=price_1xxxxx_monthly
STRIPE_YEARLY_PRICE_ID=price_1xxxxx_yearly

# Cloudinary (obtener en https://cloudinary.com/console)
# Tier gratuito: 25GB storage + 25GB bandwidth/mes
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=dreamduel_uploads  # Crear en Cloudinary console

# Email - Resend (obtener en https://resend.com/api-keys)
# Tier gratuito: 3,000 emails/mes, 100/día
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=DreamDuel <noreply@dreamduel.com>
SUPPORT_EMAIL=support@dreamduel.com

# AI Services [PLACEHOLDER - Configurar en Fase 2]
# OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
# REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxx
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx

# CORS (agregar tu dominio en producción)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://dreamduel.com

# Rate Limiting
RATE_LIMIT_GENERAL=100           # requests por minuto (general)
RATE_LIMIT_AI_FREE=10            # generaciones IA por hora (free users)
RATE_LIMIT_AI_PREMIUM=0          # 0 = ilimitado para premium
RATE_LIMIT_AUTH=5                # intentos de login por minuto

# Features & Limits
FREE_IMAGES_PER_MONTH=10         # Imágenes gratis mensuales
REFERRAL_BONUS_IMAGES=5          # Bonus por referral
MAX_UPLOAD_SIZE_MB=5             # Tamaño máximo de archivo
MAX_STORY_SCENES=10              # Máximo de escenas por historia

# Monitoring (opcional en desarrollo)
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
LOG_LEVEL=DEBUG  # DEBUG en dev, INFO en prod

# Celery (para background jobs)
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2
```

---

## 🔑 CÓMO OBTENER CREDENCIALES

### Cloudinary (Storage)
1. Crear cuenta en https://cloudinary.com
2. Dashboard → Ir a "Programmable Media" 
3. Copiar: Cloud Name, API Key, API Secret
4. Settings → Upload → Upload Presets → Crear preset "dreamduel_uploads" (unsigned)

### Resend (Email)
1. Crear cuenta en https://resend.com
2. API Keys → Create API Key
3. Copiar la key (empieza con `re_`)
4. Domains → Agregar tu dominio y verificar DNS

### Stripe (Pagos)
1. Crear cuenta en https://stripe.com
2. Dashboard → Developers → API Keys
3. Usar "Test mode" en desarrollo
4. Crear productos y precios en Products
5. Webhooks → Agregar endpoint: `https://tu-api.com/api/webhooks/stripe`

### OAuth Google
1. Google Cloud Console → https://console.cloud.google.com
2. Crear proyecto → APIs & Services → Credentials
3. Crear OAuth 2.0 Client ID (Web application)
4. Authorized redirect URIs: `https://tu-domain.com/api/auth/google/callback`

### OAuth Apple
1. Apple Developer → https://developer.apple.com
2. Certificates, Identifiers & Profiles
3. Crear Service ID para Sign In with Apple
4. Configurar Return URLs

---

## 🧪 TESTING REQUERIDO

1. **Unit tests** para servicios de dominio
2. **Integration tests** para endpoints
3. **E2E tests** para flujos críticos (registro, pago, etc.)
4. **Load testing** con Locust
5. **Cobertura mínima**: 80%

---

## 📦 DEPLOYMENT

### Docker
```dockerfile
FROM python:3.11-slim
# Multi-stage build
# Incluir migrations
# Healthcheck
```

### Docker Compose (desarrollo)
```yaml
services:
  - api
  - postgres
  - redis
  - celery worker
  - celery beat
```

### Producción (Railway)
- Deploy con git push (integración GitHub)
- PostgreSQL y Redis managed incluidos
- CI/CD automático con GitHub Actions
- Migrations automáticas (Alembic)
- Zero-downtime deployments
- Health checks y auto-restart
- Escalado horizontal automático

---

## 📝 NOTAS IMPORTANTES

### Generación de IA - PLACEHOLDERS

Los siguientes servicios **NO deben implementarse completamente**, solo dejar la estructura preparada:

1. **Generador de Imágenes IA** (`infrastructure/external_services/ai_image_service.py`)
   - Dejar clase con métodos stub
   - Documentar parámetros esperados
   - Incluir TODO comments para integración futura

2. **Generador de Historias IA** (`infrastructure/external_services/ai_story_service.py`)
   - Dejar clase con métodos stub
   - Documentar formato de respuesta esperado
   - Incluir TODO comments

3. **Endpoints /api/generate/***
   - Implementar validaciones
   - Implementar lógica de créditos
   - Llamar a servicios stub (que retornan datos mock)
   - Preparar para cambiar a implementación real

### Todo lo demás debe estar 100% funcional y listo para producción

---

## ✅ CHECKLIST DE ENTREGABLES

- [ ] FastAPI app configurada
- [ ] Modelos de BD SQLAlchemy
- [ ] Migrations con Alembic
- [ ] Sistema de autenticación completo (JWT + OAuth)
- [ ] CRUD completo de usuarios
- [ ] CRUD completo de historias
- [ ] Sistema de comentarios
- [ ] Sistema de likes/saves/follows
- [ ] Integración con Stripe (suscripciones)
- [ ] Sistema de uploads (S3/Cloudinary)
- [ ] Analytics y métricas
- [ ] Rate limiting
- [ ] Caché con Redis
- [ ] Background jobs (Celery)
- [ ] Email service
- [ ] Sistema de créditos/referrals
- [ ] Search funcional
- [ ] Tests (min 80% coverage)
- [ ] Docker setup
- [ ] Documentation (Swagger/OpenAPI)
- [ ] Health checks
- [ ] Error handling global
- [ ] Logging estructurado
- [ ] PLACEHOLDERS para generadores IA (documentados)

---

## 🎯 OBJETIVO FINAL

Un backend robusto, escalable, seguro y bien arquitecturado que:

1. Soporte TODAS las funcionalidades del frontend
2. Esté preparado para ALTA ESCALA (miles de usuarios)
3. Sea MANTENIBLE (código limpio, testeado, documentado)
4. Tenga los PLACEHOLDERS listos para conectar generadores de IA cuando estén disponibles
5. Esté listo para PRODUCCIÓN desde el día 1

**Stack principal**: FastAPI + PostgreSQL + Redis + Celery + Stripe + Cloudinary + Resend

**Hosting**: Railway (PaaS) con CI/CD automático

**Arquitectura**: DDD (Domain-Driven Design) + Clean Architecture

**Deploy ready**: Docker + GitHub Actions + Alembic Migrations + Sentry Monitoring

**Costo inicial**: ~$11-16/mes | **Timeline**: 6-10 semanas

---

## � DECISIONES DE INFRAESTRUCTURA (RECOMENDADAS)

### ✅ Stack Tecnológico Definitivo

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| **Storage** | **Cloudinary** | Optimización automática de imágenes, CDN global incluido, tier gratuito generoso (25GB), transformaciones on-the-fly |
| **Email** | **Resend** | API moderna y simple, 3,000 emails/mes gratis, excelente deliverability, templates con React |
| **Hosting** | **Railway** | Deploy súper fácil (git push), PostgreSQL + Redis incluidos, escalado automático, ideal para FastAPI |
| **Pagos** | **Stripe** | Estándar de la industria, webhooks robustos, Stripe Customer Portal incluido |
| **Frontend** | **Vercel** | Hosting gratuito, CI/CD automático, perfecto para Vue/Vite |

---

## 💰 PRESUPUESTO Y COSTOS

### Fase MVP (Primeros 3 meses)
```
✅ Railway Starter          : $10-15/mes
✅ Cloudinary Free Tier     : $0/mes (hasta 25GB storage + 25GB bandwidth)
✅ Resend Free Tier         : $0/mes (hasta 3,000 emails/mes)
✅ Stripe                   : $0 base + 2.9% + $0.30 por transacción
✅ Vercel Free Tier         : $0/mes
✅ Dominio (.com)           : $12/año (~$1/mes)
✅ SSL/HTTPS                : Gratis (incluido en Railway/Vercel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL MVP: ~$11-16/mes (sin tráfico significativo)
```

### Fase Lanzamiento (100-500 usuarios activos)
```
✅ Railway Pro              : $25-40/mes
✅ Cloudinary               : $0-49/mes (después de agotar tier gratis)
✅ Resend                   : $0-20/mes (después de 3k emails)
✅ Stripe                   : % de transacciones
✅ Monitoring (Sentry Free) : $0/mes (tier gratis hasta 5k eventos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL LANZAMIENTO: ~$50-100/mes
```

### Fase Escalada (1,000+ usuarios activos)
```
✅ Railway Scale            : $100-200/mes
✅ Cloudinary Pro           : $89-149/mes
✅ Resend Growth            : $20-80/mes
✅ Monitoring (Sentry)      : $26-80/mes
✅ APIs de IA               : $100-500/mes (depende del uso)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL ESCALADO: $335-1,009/mes
```

---

## 📅 TIMELINE DE DESARROLLO

### Fase 1: Backend Core (4-6 semanas)
```
Semana 1-2: 
  ✅ Setup inicial (FastAPI, PostgreSQL, Redis, Docker)
  ✅ Sistema de autenticación completo (JWT + OAuth)
  ✅ Modelos de base de datos y migrations

Semana 3-4:
  ✅ CRUD de usuarios y perfiles
  ✅ CRUD de historias (sin generación IA)
  ✅ Sistema de comentarios y likes
  ✅ Integración con Stripe (suscripciones)

Semana 5-6:
  ✅ Sistema de uploads (Cloudinary)
  ✅ Analytics y métricas
  ✅ Testing (80%+ coverage)
  ✅ Deploy a Railway
  ✅ Documentación OpenAPI/Swagger
```

### Fase 2: Integración IA (2-4 semanas)
```
Semana 7-8:
  ✅ Conectar generador de historias con IA
  ✅ Conectar generador de imágenes con IA
  ✅ Sistema de colas para generaciones asíncronas

Semana 9-10:
  ✅ Optimización de costos de IA
  ✅ Rate limiting y anti-abuse
  ✅ Monitoreo y alertas
  ✅ Load testing
```

### TOTAL: 6-10 semanas para backend production-ready

---

## 🔧 CONFIGURACIÓN ESPECÍFICA

### Variables de Entorno Recomendadas (.env)

```env
# App
APP_NAME=DreamDuel
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=your-secret-key-here-min-32-chars
API_V1_PREFIX=/api
ALLOWED_HOSTS=dreamduel.com,*.railway.app

# Database (Railway proporciona DATABASE_URL automáticamente)
DATABASE_URL=postgresql://user:pass@host:5432/dreamduel
REDIS_URL=redis://host:6379/0

# Auth
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# OAuth Google
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-secret

# OAuth Apple
APPLE_CLIENT_ID=com.dreamduel.signin
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_monthly_xxxxx
STRIPE_YEARLY_PRICE_ID=price_yearly_xxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=dreamduel_uploads

# Email - Resend
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=DreamDuel <noreply@dreamduel.com>
SUPPORT_EMAIL=support@dreamduel.com

# AI Services [PLACEHOLDER - Se configurará en Fase 2]
# OPENAI_API_KEY=sk-proj-...
# REPLICATE_API_TOKEN=r8_...
# ANTHROPIC_API_KEY=sk-ant-...

# CORS
CORS_ORIGINS=https://dreamduel.com,https://www.dreamduel.com,http://localhost:5173

# Rate Limiting
RATE_LIMIT_GENERAL=100  # requests por minuto
RATE_LIMIT_AI_FREE=10    # generaciones por hora (usuarios free)
RATE_LIMIT_AI_PREMIUM=0  # ilimitado para premium

# Monitoring
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
LOG_LEVEL=INFO

# Features
FREE_IMAGES_PER_MONTH=10
REFERRAL_BONUS_IMAGES=5
MAX_UPLOAD_SIZE_MB=5
```

---

## 🚀 DEPLOYMENT EN RAILWAY

### Setup Inicial (5 minutos)

1. **Crear cuenta en Railway**: https://railway.app
   
2. **Instalar CLI** (opcional):
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Crear nuevo proyecto**:
   - Conectar repositorio GitHub
   - Railway detecta automáticamente Dockerfile
   - Añadir servicio PostgreSQL (1 click)
   - Añadir servicio Redis (1 click)

4. **Configurar variables de entorno**:
   - Copiar todas las variables del .env
   - Railway proporciona DATABASE_URL y REDIS_URL automáticamente

5. **Deploy automático**:
   - Cada push a `main` → deploy automático
   - Migrations se ejecutan automáticamente
   - Health checks incluidos

### Dockerfile para Railway

```dockerfile
# Dockerfile optimizado para Railway
FROM python:3.11-slim

WORKDIR /app

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Código de la app
COPY . .

# Crear usuario no-root
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Railway usa PORT env variable
ENV PORT=8000
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Run migrations y start server
CMD alembic upgrade head && \
    gunicorn app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:$PORT \
    --timeout 120 \
    --graceful-timeout 30 \
    --log-level info
```

---

## 📚 RECURSOS Y DOCUMENTACIÓN

### SDKs y Librerías Requeridas (requirements.txt)

```txt
# Core
fastapi==0.109.0
uvicorn[standard]==0.27.0
gunicorn==21.2.0
pydantic==2.5.3
pydantic-settings==2.1.0

# Database
sqlalchemy==2.0.25
alembic==1.13.1
psycopg2-binary==2.9.9
asyncpg==0.29.0

# Auth
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
google-auth==2.27.0
python-apple-signin==0.1.0

# Cache
redis==5.0.1
hiredis==2.3.2

# Storage
cloudinary==1.38.0

# Email
resend==0.7.0

# Payments
stripe==7.12.0

# Background Jobs
celery==5.3.4
flower==2.0.1

# Monitoring
sentry-sdk[fastapi]==1.40.0

# Utils
python-dotenv==1.0.0
httpx==0.26.0
pillow==10.2.0
email-validator==2.1.0

# Testing
pytest==7.4.4
pytest-asyncio==0.23.3
pytest-cov==4.1.0
faker==22.0.0
```

---

## 🎯 ENTREGABLES FINALES

Al completar este proyecto, deberás tener:

### Código
- [x] Repositorio GitHub con código limpio y documentado
- [x] Tests con 80%+ de cobertura
- [x] CI/CD configurado (GitHub Actions + Railway)
- [x] Migrations de base de datos versionadas

### Infraestructura
- [x] Backend deployado en Railway (producción)
- [x] PostgreSQL y Redis configurados
- [x] Cloudinary configurado para storage
- [x] Stripe configurado con webhooks

### Documentación
- [x] OpenAPI/Swagger UI funcionando
- [x] README completo con instrucciones
- [x] Documentación de API endpoints
- [x] Guía de deployment

### Monitoring
- [x] Sentry configurado para error tracking
- [x] Health checks implementados
- [x] Logs estructurados
- [x] Alertas configuradas

### Seguridad
- [x] HTTPS configurado
- [x] Rate limiting activo
- [x] Validación de inputs
- [x] Secrets en variables de entorno (no en código)

---

**¡ESTE PROMPT ESTÁ 100% LISTO PARA IMPLEMENTAR EL BACKEND DE DREAMDUEL!**

**Stack Final**: FastAPI + PostgreSQL + Redis + Celery + Stripe + Cloudinary + Resend → Railway

**Costo Inicial**: ~$11-16/mes | **Timeline**: 6-10 semanas | **Production-Ready**: ✅
