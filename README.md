# Elevator Simulation

<div align="center">
  
![Vue.js](https://img.shields.io/badge/vue-3.5.17-green)
![Vite](https://img.shields.io/badge/vite-7.0.0-blue)
![Node.js](https://img.shields.io/badge/node-20.15.1-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

## Overview

An elevator simulation system built with Vue 3 and Vite. This application demonstrates advanced elevator algorithms, queue management, and real-time visualization of elevator operations in a multi-floor building environment.

The simulation features intelligent elevator dispatching, directional optimization, and comprehensive logging to showcase modern elevator control systems and algorithms.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
- [Project Structure](#project-structure)
- [Core Architecture](#core-architecture)
  - [Elevator Class](#elevator-class)
  - [Building Components](#building-components)
  - [State Management](#state-management)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [End-to-End Tests](#end-to-end-tests)
- [Build and Deployment](#build-and-deployment)
  - [Production Build](#production-build)
  - [Docker Deployment](#docker-deployment)
  - [Cloud Deployment](#cloud-deployment)
  - [CI/CD Pipeline](#cicd-pipeline)
- [Development Guidelines](#development-guidelines)
- [API Reference](#api-reference)

---

## Features

✅ **Intelligent Elevator Algorithm** - Optimized floor queue management with directional logic  
✅ **Real-time Visualization** - Dynamic elevator car positioning and status updates  
✅ **Multi-floor Building Support** - Configurable building specifications and floor counts  
✅ **Comprehensive Logging** - Detailed operation logs with timestamp tracking  
✅ **Responsive Design** - Modern UI with digital-style displays  
✅ **State Management** - Centralized state with Pinia store  
✅ **Full Test Coverage** - Unit tests with Vitest and E2E tests with Cypress  
✅ **Docker Support** - Production-ready containerization with nginx  
✅ **CI/CD Ready** - GitHub Actions workflow for automated deployment  
✅ **Production Optimized** - Multi-stage builds with security headers  

---

## Getting Started

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|--------|
| Node.js     | 20+     | Recommended: 20.15.1 or higher |
| npm         | 10+     | Comes with Node.js |
| Docker      | Latest  | Optional: For containerized deployment |

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone <repository-url>
cd elevator-simulation

# Install dependencies
npm install

# Prepare Cypress (if running for first time)
npm run prepare
```

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Quick Docker Setup

For a quick containerized setup:

```bash
# Build and run with Docker
docker build -t elevator-simulation .
docker run -d -p 8080:80 --name elevator-sim elevator-simulation

# Open http://localhost:8080 in your browser
```

---

## Project Structure

```
elevator-simulation/
├─ src/
│  ├─ classes/              # Core simulation classes
│  ├─ components/           # Vue components
│  ├─ stores/               # Pinia state stores
│  ├─ constants/            # Configuration constants
│  ├─ utils/                # Utility functions
│  └─ assets/               # Static assets
```

---

## Core Architecture

### Elevator Class

The heart of the simulation is the `Elevator` class with sophisticated queue management:

#### **Core Properties**
| Property | Type | Description |
|----------|------|-------------|
| `id` | `number` | Unique elevator identifier |
| `currentFloor` | `number` | Current elevator position |
| `queue` | `Array<number>` | Ordered list of destination floors |
| `direction` | `string|null` | Current movement direction |
| `busy` | `boolean` | Movement status indicator |
| `loading` | `boolean` | Passenger loading status |

#### **Essential Methods**
| Method | Purpose | Returns |
|--------|---------|---------|
| `addToQueue(floor)` | Queue management with duplicate prevention | `boolean` |
| `moveToFloor(floor)` | Asynchronous floor movement | `Promise<void>` |
| `loadPassengers()` | Passenger loading simulation | `Promise<void>` |
| `startMoving()` | Main elevator algorithm execution | `void` |
| `getFloorsInCurrentDirection()` | Directional pathfinding | `Array<number>` |
| `isOnTheWay(floor, direction)` | Optimal pickup determination | `boolean` |
| `getDistanceTo(floor)` | Distance calculation | `number` |
| `isIdle()` | Idle state detection | `boolean` |

### Building Components

The Vue.js architecture consists of modular, reactive components:

- **Building.vue**: Main container managing multiple elevators
- **Elevator.vue**: Individual elevator shaft with controls
- **ElevatorCar.vue**: Animated elevator car with smooth transitions
- **ElevatorStatus.vue**: Real-time status displays with digital styling

### State Management

Centralized state management using Pinia:

```javascript
// Example store usage
import { useLoggerStore } from '@/stores/logger'

const logger = useLoggerStore()
logger.addLog('Elevator 1 moving to floor 5', 1)
```

---

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
# Run tests once
npm run test:unit

# Run tests in watch mode
npm run test:unit -- --watch

# Run with coverage
npm run test:unit -- --coverage
```

**Test Coverage:**
- Elevator class logic and algorithms
- Utility functions and helpers
- Component behavior and state changes

### End-to-End Tests

Run comprehensive E2E tests with Cypress:

```bash
# Development testing (interactive)
npm run test:e2e:dev

# Production testing (headless)
npm run build
npm run test:e2e
```

---

## Build and Deployment

### Development Build
```bash
npm run dev
```
The development server will be available at `http://localhost:5173` with hot-reload and Vue DevTools.

### Production Build

```bash
npm run build
```

#### Preview Production Build Locally
```bash
npm run preview
```
The preview server will be available at `http://localhost:4173` to test the production build.

**Production Build Features:**
*Vite automatically applies all optimizations when running the build command:*
- ✅ **Code Splitting**: Vendor libraries separated from app code
- ✅ **Asset Optimization**: Minified CSS/JS with cache-busting hashes
- ✅ **Tree Shaking**: Unused code eliminated
- ✅ **Gzip Compression**: Assets compressed for faster loading
- ✅ **Vue DevTools**: Excluded from production builds

The production build will be generated in the `dist/` directory, optimized for deployment.

### Docker Deployment

#### Build Docker Image
```bash
docker build -t elevator-simulation .
```

#### Run Container Locally
```bash
# Run on port 8080
docker run -d -p 8080:80 --name elevator-sim elevator-simulation

# Run on port 80 (production-like)
docker run -d -p 80:80 --name elevator-prod --restart unless-stopped elevator-simulation
```

#### Test Docker Container
```bash
# Check container status
docker ps

# Test health endpoint
curl http://localhost:8080/health

# Test main application
curl http://localhost:8080/

# View container logs
docker logs elevator-sim

# Monitor resource usage
docker stats elevator-sim --no-stream
```

#### Container Management
```bash
# Stop container
docker stop elevator-sim

# Remove container
docker rm elevator-sim

# Restart container
docker restart elevator-sim

# View container details
docker inspect elevator-sim
```

### Cloud Deployment

The Docker image can be deployed to any container platform:

```bash
# Tag for registry
docker tag elevator-simulation your-registry/elevator-simulation:latest

# Push to registry
docker push your-registry/elevator-simulation:latest
```


### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that automatically:

1. **Tests**: Runs linting, unit tests, and E2E tests
2. **Builds**: Creates optimized production builds
3. **Containerizes**: Builds and pushes Docker images
4. **Deploys**: Ready for deployment to a platform of choice


---

## Development Guidelines

### Code Style

- **ESLint Configuration**: Follow the project's ESLint rules
- **Vue 3 Composition API**: Prefer Composition API over Options API
- **TypeScript-style JSDoc**: Document all public methods and complex logic

### Linting

```bash
npm run lint
```

---

## API Reference

### Elevator Algorithm Configuration

Configure elevator behavior via `buildingSpecs.js`:

```javascript
export const TOTAL_FLOORS = 10;
export const TOTAL_ELEVATORS = 4; 
export const FLOOR_TRAVEL_TIME = 10 * 1000;
export const STOP_DURATION = 10 * 1000;
```

### Direction Enumeration

```javascript
import Direction from '@/constants/directionEnum.js'

// Available directions
Direction.Up    // 'up'
Direction.Down  // 'down'
```

### Logging Integration

```javascript
// Custom logging function
const elevator = new Elevator(1, 1, (message, elevatorId) => {
  console.log(`[Elevator ${elevatorId}] ${message}`)
})
```

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Vladimir Velkovski** - Initial development and architecture