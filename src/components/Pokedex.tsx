import React, { useState, useEffect, useMemo } from 'react';
import './Pokedex.css';

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
      return `${process.env.PUBLIC_URL || ''}/pokeball.png`;
    } else {
      return `${process.env.PUBLIC_URL || ''}/pokeball_white.png`;
    }
  };

  const getDisplayName = () => {
    if (status === 'unknown') {
      return '---';
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
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(7); // Set Squirtle as default
  const [isLoading, setIsLoading] = useState(true);

  const pokemonList: PokemonData[] = useMemo(() => [
    { id: 1, name: 'Bulbasaur', status: 'owned', isCaught: true, isEncountered: true },
    { id: 2, name: 'Ivysaur', status: 'owned', isCaught: true, isEncountered: true },
    { id: 3, name: 'Venusaur', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 4, name: 'Charmander', status: 'owned', isCaught: true, isEncountered: true },
    { id: 5, name: 'Charmeleon', status: 'owned', isCaught: true, isEncountered: true },
    { id: 6, name: 'Charizard', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 7, name: 'Squirtle', status: 'owned', isCaught: true, isEncountered: true },
    { id: 8, name: 'Wartortle', status: 'seen', isCaught: false, isEncountered: true },
    { id: 9, name: 'Blastoise', status: 'seen', isCaught: false, isEncountered: true },
    { id: 10, name: 'Caterpie', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 11, name: 'Metapod', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 12, name: 'Butterfree', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 13, name: 'Weedle', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 14, name: 'Kakuna', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 15, name: 'Beedrill', status: 'seen', isCaught: false, isEncountered: true },
    { id: 16, name: 'Pidgey', status: 'seen', isCaught: false, isEncountered: true },
    { id: 17, name: 'Pidgeotto', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 18, name: 'Pidgeot', status: 'seen', isCaught: false, isEncountered: true },
    { id: 19, name: 'Rattata', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 20, name: 'Raticate', status: 'seen', isCaught: false, isEncountered: true },
    { id: 21, name: 'Spearow', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 22, name: 'Fearow', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 23, name: 'Ekans', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 24, name: 'Arbok', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 25, name: 'Pikachu', status: 'seen', isCaught: false, isEncountered: true },
    { id: 26, name: 'Raichu', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 27, name: 'Sandshrew', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 28, name: 'Sandslash', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 29, name: 'Nidoran♀', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 30, name: 'Nidorina', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 31, name: 'Nidoqueen', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 32, name: 'Nidoran♂', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 33, name: 'Nidorino', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 34, name: 'Nidoking', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 35, name: 'Clefairy', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 36, name: 'Clefable', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 37, name: 'Vulpix', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 38, name: 'Ninetales', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 39, name: 'Jigglypuff', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 40, name: 'Wigglytuff', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 41, name: 'Zubat', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 42, name: 'Golbat', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 43, name: 'Oddish', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 44, name: 'Gloom', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 45, name: 'Vileplume', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 46, name: 'Paras', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 47, name: 'Parasect', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 48, name: 'Venonat', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 49, name: 'Venomoth', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 50, name: 'Diglett', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 51, name: 'Dugtrio', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 52, name: 'Meowth', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 53, name: 'Persian', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 54, name: 'Psyduck', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 55, name: 'Golduck', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 56, name: 'Mankey', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 57, name: 'Primeape', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 58, name: 'Growlithe', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 59, name: 'Arcanine', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 60, name: 'Poliwag', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 61, name: 'Poliwhirl', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 62, name: 'Poliwrath', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 63, name: 'Abra', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 64, name: 'Kadabra', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 65, name: 'Alakazam', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 66, name: 'Machop', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 67, name: 'Machoke', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 68, name: 'Machamp', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 69, name: 'Bellsprout', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 70, name: 'Weepinbell', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 71, name: 'Victreebel', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 72, name: 'Tentacool', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 73, name: 'Tentacruel', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 74, name: 'Geodude', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 75, name: 'Graveler', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 76, name: 'Golem', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 77, name: 'Ponyta', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 78, name: 'Rapidash', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 79, name: 'Slowpoke', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 80, name: 'Slowbro', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 81, name: 'Magnemite', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 82, name: 'Magneton', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 83, name: 'Farfetch\'d', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 84, name: 'Doduo', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 85, name: 'Dodrio', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 86, name: 'Seel', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 87, name: 'Dewgong', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 88, name: 'Grimer', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 89, name: 'Muk', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 90, name: 'Shellder', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 91, name: 'Cloyster', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 92, name: 'Gastly', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 93, name: 'Haunter', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 94, name: 'Gengar', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 95, name: 'Onix', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 96, name: 'Drowzee', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 97, name: 'Hypno', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 98, name: 'Krabby', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 99, name: 'Kingler', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 100, name: 'Voltorb', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 101, name: 'Electrode', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 102, name: 'Exeggcute', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 103, name: 'Exeggutor', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 104, name: 'Cubone', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 105, name: 'Marowak', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 106, name: 'Hitmonlee', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 107, name: 'Hitmonchan', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 108, name: 'Lickitung', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 109, name: 'Koffing', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 110, name: 'Weezing', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 111, name: 'Rhyhorn', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 112, name: 'Rhydon', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 113, name: 'Chansey', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 114, name: 'Tangela', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 115, name: 'Kangaskhan', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 116, name: 'Horsea', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 117, name: 'Seadra', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 118, name: 'Goldeen', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 119, name: 'Seaking', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 120, name: 'Staryu', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 121, name: 'Starmie', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 122, name: 'Mr. Mime', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 123, name: 'Scyther', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 124, name: 'Jynx', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 125, name: 'Electabuzz', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 126, name: 'Magmar', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 127, name: 'Pinsir', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 128, name: 'Tauros', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 129, name: 'Magikarp', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 130, name: 'Gyarados', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 131, name: 'Lapras', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 132, name: 'Ditto', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 133, name: 'Eevee', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 134, name: 'Vaporeon', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 135, name: 'Jolteon', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 136, name: 'Flareon', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 137, name: 'Porygon', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 138, name: 'Omanyte', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 139, name: 'Omastar', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 140, name: 'Kabuto', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 141, name: 'Kabutops', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 142, name: 'Aerodactyl', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 143, name: 'Snorlax', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 144, name: 'Articuno', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 145, name: 'Zapdos', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 146, name: 'Moltres', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 147, name: 'Dratini', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 148, name: 'Dragonair', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 149, name: 'Dragonite', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 150, name: 'Mewtwo', status: 'unknown', isCaught: false, isEncountered: false },
    { id: 151, name: 'Mew', status: 'unknown', isCaught: false, isEncountered: false },
  ], []);

  const selectedPokemonData = selectedPokemon ? pokemonList.find(p => p.id === selectedPokemon) : null;

  const seenCount = pokemonList.filter(p => p.isEncountered).length;
  const ownedCount = pokemonList.filter(p => p.isCaught).length;

  useEffect(() => {
    if (selectedPokemon) {
      setIsLoading(true);
      // Add a small delay to prevent flickering
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100); // Reduced delay to 100ms for smoother transitions
      
      return () => clearTimeout(timer);
    }
  }, [selectedPokemon]);

  const handlePokemonSelect = (id: number) => {
    setSelectedPokemon(id);
  };

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
          {/* Pokemon Viewer */}
          <div className="pokemon-viewer">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <>
                {/* Conditional rendering of 3D models - only render the selected one */}
                {selectedPokemonData?.id === 1 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Bulbasaur - Pokemon" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/853e861e891047c0883860db627adb35/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 1 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 2 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Ivysaur" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/16174087ee1b44bbabf5858aee8592aa/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 2 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 4 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Charmander" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/48b8d7c40bff4e36aa39938675b701c3/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 4 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 5 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Charmeleon" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/80fe151ad45d46bd80c4b9d2779c48a9/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 5 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 7 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="007 Squirtle" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/102ca3237aac44a6b5b15d6e3fbdc1df/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 7 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 8 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Wartortle" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/f64ed3dc727a4c848e2e11a71d93a269/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 8 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 9 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Blastoise" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/417667e24bf14139b4de351c9b79b789/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 9 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 15 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Beedrill" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/99f9c65ac9114609a2e91b20b5633f8b/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 15 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 16 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Pidgey" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/312591c6f0894d59985c57ddd77e4c66/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 16 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 18 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Pidgeot" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/9eca0263ac454a41a797319b72b0f6f3/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 18 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 20 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Raticate" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/74934c92b0414260a953d009152633ac/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 20 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {selectedPokemonData?.id === 25 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Pikachu" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/273766237c614ab1bbaf094c9fc72a3e/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 25 loaded')}
                      {...{
                        'mozallowfullscreen': 'true',
                        'webkitallowfullscreen': 'true',
                        'xr-spatial-tracking': 'true',
                        'execution-while-out-of-viewport': 'true',
                        'execution-while-not-rendered': 'true',
                        'web-share': 'true'
                      } as any}>
                    </iframe>
                  </div>
                )}

                {/* Placeholder Image for Other Pokemon */}
                {(!selectedPokemonData || ![1, 2, 4, 5, 7, 8, 9, 15, 16, 18, 20, 25].includes(selectedPokemonData.id)) && (
                  <div className="pokemon-image-container">
                    <img
                      src={`${process.env.PUBLIC_URL || ''}/empty.png`}
                      alt="Pokemon"
                      className="pokemon-image"
                      onLoad={() => console.log('Image loaded successfully')}
                      onError={(e) => console.error('Image failed to load:', e)}
                    />
                  </div>
                )}
              </>
            )}
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
                onClick={() => handlePokemonSelect(pokemon.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pokedex; 