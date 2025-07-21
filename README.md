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

---

## Getting Started

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|--------|
| Node.js     | 20+     | Recommended: 20.15.1 or higher |
| npm         | 10+     | Comes with Node.js |

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

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The production build will be generated in the `dist/` directory, optimized for deployment.

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