# JWT Authentication with Prisma + MySQL

A clean, simple JWT authentication system for NestJS with role-based access control.

## Features

- ✅ JWT authentication using `@nestjs/jwt` and `@nestjs/passport`
- ✅ Two roles: `CLIENT` and `ADMIN`
- ✅ Role-based access control with simple guards
- ✅ Password hashing with bcrypt
- ✅ Prisma ORM with MySQL
- ✅ Docker Compose MySQL setup

## File Structure

```
src/
├── auth/
│   ├── auth.controller.ts      # Login/register endpoints
│   ├── auth.service.ts         # Authentication business logic
│   ├── auth.module.ts          # Auth module
│   ├── entities/
│   │   └── user.entity.ts      # User types from Prisma
│   ├── dto/
│   │   └── auth.dto.ts         # Request/response DTOs
│   ├── guards/
│   │   ├── auth.guard.ts       # JWT authentication guard
│   │   ├── admin.guard.ts      # Admin role guard
│   │   └── client.guard.ts     # Client role guard
│   ├── strategies/
│   │   └── jwt.strategy.ts     # JWT passport strategy
│   └── decorators/
│       └── current-user.decorator.ts # Get current user
├── database/
│   ├── prisma.service.ts       # Prisma service
│   └── database.module.ts      # Database module
└── prisma/
    ├── schema.prisma           # Database schema
    └── seed.ts                 # Seed data
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (requires auth)
- `GET /api/v1/auth/admin-only` - Admin only endpoint
- `GET /api/v1/auth/client-only` - Client only endpoint

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Access protected endpoint
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Admin only endpoint
```bash
curl -X GET http://localhost:3000/api/v1/auth/admin-only \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Guards Usage

### In Controllers
```typescript
// Require authentication only
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  return user;
}

// Require admin role
@UseGuards(JwtAuthGuard, AdminGuard)
@Get('admin-data')
async getAdminData() {
  return { message: 'Admin only data' };
}

// Require client role
@UseGuards(JwtAuthGuard, ClientGuard)
@Get('client-data')
async getClientData(@CurrentUser() user: User) {
  return { message: 'Client data', userId: user.id };
}
```

## Setup Instructions

1. **Start MySQL container**:
   ```bash
   docker-compose up mysql -d
   ```

2. **Run database migration**:
   ```bash
   npm run db:migrate
   ```

3. **Seed the database**:
   ```bash
   npm run db:seed
   ```

4. **Start the application**:
   ```bash
   npm run start:dev
   ```

## Default Users

After seeding, you'll have:
- **Admin**: `admin@expanders360.com` / `admin123`
- **Client**: `client@expanders360.com` / `client123`

## Environment Variables

```env
DATABASE_URL="mysql://root:password@localhost:3306/expanders360"
JWT_SECRET="your-super-secret-jwt-key-here"
```

## Database Scripts

```bash
npm run db:migrate    # Create and apply migrations
npm run db:generate   # Generate Prisma client
npm run db:seed       # Seed database with initial data
npm run db:reset      # Reset database
npm run db:studio     # Open Prisma Studio
```

## Role-Based Access Control

- **CLIENTS**: Can manage their own projects, access client-specific endpoints
- **ADMINS**: Can manage vendors, system configurations, access all endpoints

The system uses simple, dedicated guards for each role, making it easy to understand and maintain.

## Simplified Architecture

- **No Local Strategy**: Login endpoint directly validates credentials in AuthService
- **Single JWT Strategy**: Only validates JWT tokens and finds users
- **Simple Guards**: One guard for authentication, one for each role
- **No Redundancy**: Removed unnecessary LocalAuthGuard and LocalStrategy
