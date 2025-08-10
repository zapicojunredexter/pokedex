import React, { useState } from 'react';
import './Pokedex.css';

// Pokemon Image Component - Using @empty.png with borders
const PokemonImage: React.FC<{ pokemonId: number }> = ({ pokemonId }) => {
  return (
    <div className="pokemon-image-container">
      <img 
        src={process.env.PUBLIC_URL + '/empty.png'} 
        alt="Pokemon placeholder" 
        className="pokemon-image"
        onLoad={() => console.log('Image loaded successfully')}
        onError={(e) => console.error('Image failed to load:', e)}
      />
    </div>
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
        src="https://sketchfab.com/models/4c9dfbb590744368a05f1bed1fbf8d3e/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&transparent=1"
        style={{width: '100%', height: '100%', border: 'none'}}
      />
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
  const getPokeballIcon = () => {
    if (status === 'owned') {
      return process.env.PUBLIC_URL + '/pokeball.png';
    } else {
      return process.env.PUBLIC_URL + '/pokeball_white.png';
    }
  };

  const getDisplayName = () => {
    if (status === 'unknown') {
      return '----------';
    }
    return name;
  };

  return (
    <div 
      className={`pokemon-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="pokemon-info">
        <div className="pokemon-number-container">
          <img 
            src={getPokeballIcon()} 
            alt="Pokeball" 
            className="pokeball-icon-small"
          />
          <span className="pokemon-number">{String(id).padStart(3, '0')}</span>
        </div>
        <span className="pokemon-name">{getDisplayName()}</span>
      </div>
    </div>
  );
};

// Pokemon data interface
interface PokemonData {
  id: number;
  name: string;
  status: 'owned' | 'seen' | 'unknown';
  isCaught: boolean;
  isEncountered: boolean;
}

// Main Pokédex Component
const Pokedex: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(4);
  const [seenCount] = useState(12);
  const [ownedCount] = useState(9);

  // Pokemon data array for easy updates
  const pokemonList: PokemonData[] = [
    { id: 1, name: 'Bulbasaur', status: 'owned', isCaught: true, isEncountered: true },
    { id: 2, name: 'Ivysaur', status: 'owned', isCaught: true, isEncountered: true },
    { id: 3, name: 'Venusaur', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 4, name: 'Charmander', status: 'owned', isCaught: true, isEncountered: true },
    { id: 5, name: 'Charmeleon', status: 'owned', isCaught: true, isEncountered: true },
    { id: 6, name: 'Charizard', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 7, name: 'Squirtle', status: 'owned', isCaught: true, isEncountered: true },
    { id: 8, name: 'Wartortle', status: 'seen', isCaught: false, isEncountered: true },
    { id: 9, name: 'Blastoise', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 10, name: 'Caterpie', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 151, name: 'Mew', status: 'owned', isCaught: true, isEncountered: true },
  ];

  const selectedPokemonData = pokemonList.find(p => p.id === selectedPokemon);

  return (
    <div className="pokedex-container">
      <div className="pokedex-header">
        <h1>Kanto Pokédex</h1>
      </div>
      
      <div className="pokedex-body">
        {/* Left Panel - Pokemon Display */}
        <div className="pokedex-left-panel">
          <div className="pokemon-name-display">
            <div className="name-content">
              {selectedPokemonData?.name || 'Unknown'}
            </div>
          </div>
          
          <div className="pokemon-viewer">
            {selectedPokemon === 151 ? (
              <SketchfabViewer />
            ) : (
              <PokemonImage pokemonId={selectedPokemon} />
            )}
          </div>
          
          <div className="pokemon-stats">
            <div className="stats-content">
              <div>Seen: {seenCount}</div>
              <div>Owned: {ownedCount}</div>
            </div>
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