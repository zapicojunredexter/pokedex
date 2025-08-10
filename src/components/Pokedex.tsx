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
        <h1>KANTO POKÉDEX</h1>
      </div>
      <div className="pokedex-body">
        <div className="pokedex-left-panel">
          <div className="pokemon-name-display">
            <div className="name-content">
              {selectedPokemonData?.name || 'Unknown'}
            </div>
          </div>
          <div className="pokemon-viewer">
            <PokemonImage pokemonId={selectedPokemon} />
          </div>
          <div className="pokemon-stats">
            <div className="stats-content">
              <div>Seen: {seenCount}</div>
              <div>Owned: {ownedCount}</div>
            </div>
          </div>
        </div>
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