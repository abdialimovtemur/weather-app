# 🌤️ Weather App

[English](#english) | [O'zbekcha](#uzbekcha)

## 🇺🇿 O'zbekcha

### 📋 Loyiha haqida

Weather App - bu zamonaviy va chiroyli interfeysga ega ob-havo ma'lumotlarini ko'rsatuvchi veb-ilova. Ilova OpenWeatherMap API yordamida haqiqiy vaqtda ob-havo ma'lumotlarini olish va ko'rsatish imkonini beradi.

### ✨ Asosiy xususiyatlar

- 🌍 Shahar nomi bo'yicha ob-havo qidirish
- 📍 Geolokatsiya orqali joriy joylashuv ob-havosi
- 🌡️ Joriy ob-havo ma'lumotlari (harorat, namlik, shamol tezligi)
- 📅 7 kunlik ob-havo bashorati
- ⏰ 3 soatlik batafsil bashorat
- 🌙 Tema almashish (qorong'i/yorug' rejim)
- 📱 Responsive dizayn
- 🎨 Chiroyli animatsiyalar va ikonkalar
- 🗺️ Shahar koordinatalari orqali ob-havo ma'lumotlari

### 🛠️ Ishlatilgan texnologiyalar

#### Frontend Framework
- **React 19** - Zamonaviy React hook'lar va funksiyalar
- **TypeScript** - Type-safe development
- **Vite** - Tezkor development server va build tool

#### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Chiroyli animatsiyalar
- **Lottie React** - JSON formatdagi animatsiyalar

#### State Management & Data Fetching
- **TanStack React Query** - Server state management
- **Axios** - HTTP client

#### Routing
- **React Router DOM 7** - Client-side routing

#### UI Components
- **Lucide React** - Chiroyli ikonkalar
- **Class Variance Authority** - Component variant'lar
- **clsx & tailwind-merge** - Conditional class'lar

#### Testing
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing
- **jsdom** - DOM environment testing

### 🚀 O'rnatish va ishga tushirish

#### Talablar
- Node.js 18+ 
- npm yoki yarn

#### O'rnatish
```bash
# Repository'ni klonlash
git clone <repository-url>
cd weather-app

# Dependencies'ni o'rnatish
npm install

# Environment variables'ni sozlash
cp .env.example .env
```

#### Environment Variables
`.env` faylida quyidagi o'zgaruvchilarni sozlang:
```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

OpenWeatherMap API kalitini olish uchun [OpenWeatherMap](https://openweathermap.org/api) saytiga tashrif buyuring.

#### Development server'ni ishga tushirish
```bash
npm run dev
```

Ilova `http://localhost:5173` manzilida ochiladi.

### 🧪 Testlash

#### Barcha testlarni ishga tushirish
```bash
npm test
```

#### Test coverage'ni ko'rish
```bash
npm run test:coverage
```

#### Test UI'ni ochish
```bash
npm run test:ui
```

#### Bir martalik test ishga tushirish
```bash
npm run test:run
```

### 📁 Loyiha strukturasi

```
src/
├── app/                    # App configuration
│   ├── layouts/           # Layout components
│   ├── providers/         # Context providers
│   └── routes/            # Routing configuration
├── components/             # Reusable UI components
├── entities/               # Business logic entities
│   └── weather/           # Weather-related logic
├── features/               # Feature-based modules
│   ├── searchCity/        # City search functionality
│   └── theme-switcher/    # Theme switching
├── pages/                  # Page components
├── shared/                 # Shared utilities and components
└── widgets/                # Complex UI widgets
```

### 🔧 Build va Production

#### Production build
```bash
npm run build
```

#### Build preview
```bash
npm run preview
```

#### Linting
```bash
npm run lint
```

### 📱 Ilovani ishlatish

1. **Bosh sahifa** - Joriy ob-havo ma'lumotlari
2. **Forecast** - 7 kunlik va 3 soatlik bashorat
3. **Settings** - Ilova sozlamalari

### 🌐 API Endpoints

Ilova quyidagi OpenWeatherMap API endpoint'larini ishlatadi:
- `/weather` - Joriy ob-havo
- `/geo/1.0/direct` - Shahar geocoding
- `/geo/1.0/reverse` - Reverse geocoding
- `/data/3.0/onecall` - Batafsil bashorat

---

## 🇺🇸 English

### 📋 About the Project

Weather App is a modern and beautiful web application that displays weather information. The app provides the ability to get and display real-time weather data using the OpenWeatherMap API.

### ✨ Key Features

- 🌍 Weather search by city name
- 📍 Current location weather via geolocation
- 🌡️ Current weather data (temperature, humidity, wind speed)
- 📅 7-day weather forecast
- ⏰ 3-hour detailed forecast
- 🌙 Theme switching (dark/light mode)
- 📱 Responsive design
- 🎨 Beautiful animations and icons
- 🗺️ Weather data via city coordinates

### 🛠️ Technologies Used

#### Frontend Framework
- **React 19** - Modern React hooks and functions
- **TypeScript** - Type-safe development
- **Vite** - Fast development server and build tool

#### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Beautiful animations
- **Lottie React** - JSON format animations

#### State Management & Data Fetching
- **TanStack React Query** - Server state management
- **Axios** - HTTP client

#### Routing
- **React Router DOM 7** - Client-side routing

#### UI Components
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variants
- **clsx & tailwind-merge** - Conditional classes

#### Testing
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing
- **jsdom** - DOM environment testing

### 🚀 Installation and Setup

#### Requirements
- Node.js 18+
- npm or yarn

#### Installation
```bash
# Clone repository
git clone <repository-url>
cd weather-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

#### Environment Variables
Configure the following variables in `.env` file:
```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

Visit [OpenWeatherMap](https://openweathermap.org/api) to get your API key.

#### Start development server
```bash
npm run dev
```

The app will open at `http://localhost:5173`.

### 🧪 Testing

#### Run all tests
```bash
npm test
```

#### View test coverage
```bash
npm run test:coverage
```

#### Open test UI
```bash
npm run test:ui
```

#### Run tests once
```bash
npm run test:run
```

### 📁 Project Structure

```
src/
├── app/                    # App configuration
│   ├── layouts/           # Layout components
│   ├── providers/         # Context providers
│   └── routes/            # Routing configuration
├── components/             # Reusable UI components
├── entities/               # Business logic entities
│   └── weather/           # Weather-related logic
├── features/               # Feature-based modules
│   ├── searchCity/        # City search functionality
│   └── theme-switcher/    # Theme switching
├── pages/                  # Page components
├── shared/                 # Shared utilities and components
└── widgets/                # Complex UI widgets
```

### 🔧 Build and Production

#### Production build
```bash
npm run build
```

#### Build preview
```bash
npm run preview
```

#### Linting
```bash
npm run lint
```

### 📱 How to Use the App

1. **Home Page** - Current weather information
2. **Forecast** - 7-day and 3-hour forecasts
3. **Settings** - App settings

### 🌐 API Endpoints

The app uses the following OpenWeatherMap API endpoints:
- `/weather` - Current weather
- `/geo/1.0/direct` - City geocoding
- `/geo/1.0/reverse` - Reverse geocoding
- `/data/3.0/onecall` - Detailed forecast

---

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue in the repository.
