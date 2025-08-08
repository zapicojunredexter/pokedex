import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './Pokedex.css';

// 3D Black Box Component
const BlackBox: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
};

// Sketchfab Viewer Component
const SketchfabViewer: React.FC = () => {
  return (
    <div className="sketchfab-embed-wrapper">
      <iframe 
        title="Mew Pokémon" 
        frameBorder="0" 
        allowFullScreen 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
        src="https://sketchfab.com/models/4c9dfbb590744368a05f1bed1fbf8d3e/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_animations=0"
        style={{width: '100%', height: '100%', border: 'none'}}
      />
      <p style={{fontSize: '13px', fontWeight: 'normal', margin: '5px', color: '#4A4A4A'}}>
        <a 
          href="https://sketchfab.com/3d-models/mew-pokemon-4c9dfbb590744368a05f1bed1fbf8d3e?utm_medium=embed&utm_campaign=share-popup&utm_content=4c9dfbb590744368a05f1bed1fbf8d3e" 
          target="_blank" 
          rel="noreferrer" 
          style={{fontWeight: 'bold', color: '#1CAAD9'}}
        >
          Mew Pokémon
        </a> by <a 
          href="https://sketchfab.com/germydan?utm_medium=embed&utm_campaign=share-popup&utm_content=4c9dfbb590744368a05f1bed1fbf8d3e" 
          target="_blank" 
          rel="noreferrer" 
          style={{fontWeight: 'bold', color: '#1CAAD9'}}
        >
          germydan
        </a> on <a 
          href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=4c9dfbb590744368a05f1bed1fbf8d3e" 
          target="_blank" 
          rel="noreferrer" 
          style={{fontWeight: 'bold', color: '#1CAAD9'}}
        >
          Sketchfab
        </a>
      </p>
    </div>
  );
};

// Pokemon List Item Component
interface PokemonItemProps {
  id: number;
  name: string;
  status: 'owned' | 'seen' | 'unknown';
  isSelected: boolean;
  onClick: () => void;
}

const PokemonItem: React.FC<PokemonItemProps> = ({ id, name, status, isSelected, onClick }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'owned':
        return <div className="pokeball-icon">⚪</div>;
      case 'seen':
        return <div className="seen-icon">○</div>;
      case 'unknown':
        return <div className="unknown-icon"></div>;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`pokemon-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="pokemon-status">
        {getStatusIcon()}
      </div>
      <div className="pokemon-info">
        <span className="pokemon-number">{String(id).padStart(3, '0')}</span>
        <span className="pokemon-name">{name}</span>
      </div>
    </div>
  );
};

// Main Pokédex Component
const Pokedex: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(4);
  const [seenCount] = useState(12);
  const [ownedCount] = useState(9);

  const pokemonList = [
    { id: 1, name: 'Bulbasaur', status: 'owned' as const },
    { id: 2, name: 'Ivysaur', status: 'owned' as const },
    { id: 3, name: 'Venusaur', status: 'unknown' as const },
    { id: 4, name: 'Charmander', status: 'owned' as const },
    { id: 5, name: 'Charmeleon', status: 'owned' as const },
    { id: 6, name: 'Charizard', status: 'unknown' as const },
    { id: 7, name: 'Squirtle', status: 'owned' as const },
    { id: 8, name: 'Wartortle', status: 'seen' as const },
    { id: 9, name: 'Blastoise', status: 'unknown' as const },
    { id: 10, name: 'Caterpie', status: 'unknown' as const },
    { id: 151, name: 'Mew', status: 'owned' as const },
  ];

  const selectedPokemonData = pokemonList.find(p => p.id === selectedPokemon);

  return (
    <div className="pokedex-container">
      <div className="pokedex-header">
        <h1>Kanto Pokédex</h1>
      </div>
      
      <div className="pokedex-body">
        {/* Left Panel - 3D Viewer */}
        <div className="pokedex-left-panel">
          <div className="pokemon-name-display">
            {selectedPokemonData?.name || 'Unknown'}
          </div>
          
          <div className="pokemon-viewer">
            {selectedPokemon === 151 ? (
              <SketchfabViewer />
            ) : (
              <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <BlackBox />
                <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
              </Canvas>
            )}
          </div>
          
          <div className="pokemon-stats">
            <div>Seen: {seenCount}</div>
            <div>Owned: {ownedCount}</div>
          </div>
        </div>
        
        {/* Right Panel - Pokemon List */}
        <div className="pokedex-right-panel">
          <div className="pokemon-list">
            {pokemonList.map((pokemon) => (
              <PokemonItem
                key={pokemon.id}
                id={pokemon.id}
                name={pokemon.name}
                status={pokemon.status}
                isSelected={pokemon.id === selectedPokemon}
                onClick={() => setSelectedPokemon(pokemon.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pokedex; 