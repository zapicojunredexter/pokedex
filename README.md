# Pokédex React App

A modern React Pokédex built with Create React App, TypeScript, and Three.js. Features a classic Pokédex interface with 3D viewer capabilities.

## Features

- 🎮 Classic Pokédex UI design
- 🎨 Authentic "Press Start 2P" pixel font
- 📱 Responsive design
- 🎯 Interactive 3D viewer with Three.js
- 🔗 Sketchfab integration for Mew 3D model
- ⚡ Built with Create React App
- 🚀 Automatic GitHub Pages deployment

## Tech Stack

- **React 19** with TypeScript
- **Create React App** for development and building
- **Three.js** with React Three Fiber for 3D graphics
- **CSS3** for styling
- **GitHub Actions** for CI/CD

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pokedex
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build for Production

```bash
npm run build
```

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions. Simply push to the `main` branch and the app will be deployed automatically.

## Project Structure

```
src/
├── components/
│   ├── Pokedex.tsx      # Main Pokédex component
│   └── Pokedex.css      # Pokédex styling
├── App.tsx              # Main app component
├── App.css              # App styling
└── index.tsx           # Entry point
```

## Features

### Pokemon List
- Scrollable list of Pokemon
- Status indicators (owned, seen, unknown)
- Click to select and view Pokemon

### 3D Viewer
- Black cube for regular Pokemon
- Interactive Sketchfab embed for Mew
- Orbit controls for 3D navigation

### Responsive Design
- Works on desktop and mobile devices
- Maintains Pokédex aesthetic across screen sizes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
