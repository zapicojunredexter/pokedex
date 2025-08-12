import React, { useState, useEffect, useMemo, useRef } from 'react';
import './Pokedex.css';

// Pokemon List Item Component
interface PokemonItemProps {
  id: number;
  name: string;
  status: 'owned' | 'seen' | 'unknown';
  types: string[];
  isSelected: boolean;
  onClick: () => void;
}

const PokemonItem: React.FC<PokemonItemProps> = ({ id, name, status, types, isSelected, onClick }) => {
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
  types: string[];
  description: string;
  habitat: string;
  height: string;
  weight: string;
  category: string;
}

// Main Pokédex Component
const Pokedex: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(7); // Set Squirtle as default
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailsOverlay, setShowDetailsOverlay] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [volume, setVolume] = useState(0.5);
  const [isVolumeSliderOpen, setIsVolumeSliderOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [showPokemonNumbers, setShowPokemonNumbers] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const pokemonListRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isVolumeSliderOpen) {
        const target = event.target as Element;
        const audioControlContainer = document.querySelector('.audio-control-container');
        
        if (audioControlContainer && !audioControlContainer.contains(target)) {
          setIsVolumeSliderOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVolumeSliderOpen]);

  const [pokemonList, setPokemonList] = useState<PokemonData[]>([
    { 
      id: 1, 
      name: 'Bulbasaur', 
      status: 'owned', 
      isCaught: true, 
      isEncountered: true,
      types: ['Grass', 'Poison'],
      description: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
      habitat: 'Grasslands and forests',
      height: '0.7 m',
      weight: '6.9 kg',
      category: 'Seed Pokémon'
    },
    { 
      id: 2, 
      name: 'Ivysaur', 
      status: 'owned', 
      isCaught: true, 
      isEncountered: true,
      types: ['Grass', 'Poison'],
      description: 'When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.',
      habitat: 'Grasslands and forests',
      height: '1.0 m',
      weight: '13.0 kg',
      category: 'Seed Pokémon'
    },
    { 
      id: 3, 
      name: 'Venusaur', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Grass', 'Poison'],
      description: 'The plant blooms when it absorbs solar energy. It stays on the move to seek sunlight.',
      habitat: 'Grasslands and forests',
      height: '2.0 m',
      weight: '100.0 kg',
      category: 'Seed Pokémon'
    },
    { 
      id: 4, 
      name: 'Charmander', 
      status: 'owned', 
      isCaught: true, 
      isEncountered: true,
      types: ['Fire'],
      description: 'Obviously prefers hot things. When it rains, steam is said to spout from the tip of its tail.',
      habitat: 'Mountain ranges and caves',
      height: '0.6 m',
      weight: '8.5 kg',
      category: 'Lizard Pokémon'
    },
    { 
      id: 5, 
      name: 'Charmeleon', 
      status: 'owned', 
      isCaught: true, 
      isEncountered: true,
      types: ['Fire'],
      description: 'When it swings its burning tail, it elevates the temperature to unbearably hot levels.',
      habitat: 'Mountain ranges and caves',
      height: '1.1 m',
      weight: '19.0 kg',
      category: 'Flame Pokémon'
    },
    { 
      id: 6, 
      name: 'Charizard', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Fire', 'Flying'],
      description: 'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.',
      habitat: 'Mountain ranges and caves',
      height: '1.7 m',
      weight: '90.5 kg',
      category: 'Flame Pokémon'
    },
    { 
      id: 7, 
      name: 'Squirtle', 
      status: 'owned', 
      isCaught: true, 
      isEncountered: true,
      types: ['Water'],
      description: 'After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.',
      habitat: 'Oceans and beaches',
      height: '0.5 m',
      weight: '9.0 kg',
      category: 'Tiny Turtle Pokémon'
    },
    { 
      id: 8, 
      name: 'Wartortle', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Water'],
      description: 'Often hides in water to stalk unwary prey. For swimming fast, it moves its ears to maintain balance.',
      habitat: 'Oceans and beaches',
      height: '1.0 m',
      weight: '22.5 kg',
      category: 'Turtle Pokémon'
    },
    { 
      id: 9, 
      name: 'Blastoise', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Water'],
      description: 'A brutal Pokémon with pressurized water jets on its shell. They are used for high speed tackles.',
      habitat: 'Oceans and beaches',
      height: '1.6 m',
      weight: '85.5 kg',
      category: 'Shellfish Pokémon'
    },
    { 
      id: 10, 
      name: 'Caterpie', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Bug'],
      description: 'Its short feet are tipped with suction pads that enable it to tirelessly climb slopes and walls.',
      habitat: 'Forests and grasslands',
      height: '0.3 m',
      weight: '2.9 kg',
      category: 'Worm Pokémon'
    },
    { 
      id: 11, 
      name: 'Metapod', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Bug'],
      description: 'This Pokémon is vulnerable to attack while its shell is soft, exposing its weak and tender body.',
      habitat: 'Forests and grasslands',
      height: '0.7 m',
      weight: '9.9 kg',
      category: 'Cocoon Pokémon'
    },
    { 
      id: 12, 
      name: 'Butterfree', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Bug', 'Flying'],
      description: 'In battle, it flaps its wings at high speed to release highly toxic dust into the air.',
      habitat: 'Forests and grasslands',
      height: '1.1 m',
      weight: '32.0 kg',
      category: 'Butterfly Pokémon'
    },
    { 
      id: 13, 
      name: 'Weedle', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Bug', 'Poison'],
      description: 'Often found in forests, eating leaves. It has a sharp venomous stinger on its head.',
      habitat: 'Forests and grasslands',
      height: '0.3 m',
      weight: '3.2 kg',
      category: 'Hairy Bug Pokémon'
    },
    { 
      id: 14, 
      name: 'Kakuna', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Bug', 'Poison'],
      description: 'Almost incapable of moving, this Pokémon can only harden its shell to protect itself from predators.',
      habitat: 'Forests and grasslands',
      height: '0.6 m',
      weight: '10.0 kg',
      category: 'Cocoon Pokémon'
    },
    { 
      id: 15, 
      name: 'Beedrill', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Bug', 'Poison'],
      description: 'Flies at high speed and attacks using its large venomous stingers on its forelegs and tail.',
      habitat: 'Forests and grasslands',
      height: '1.0 m',
      weight: '29.5 kg',
      category: 'Poison Bee Pokémon'
    },
    { 
      id: 16, 
      name: 'Pidgey', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Normal', 'Flying'],
      description: 'A common sight in forests and woods. It flaps its wings at ground level to kick up blinding sand.',
      habitat: 'Forests and grasslands',
      height: '0.3 m',
      weight: '1.8 kg',
      category: 'Tiny Bird Pokémon'
    },
    { 
      id: 17, 
      name: 'Pidgeotto', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Normal', 'Flying'],
      description: 'Very protective of its sprawling territorial area. This Pokémon will fiercely peck at any intruder.',
      habitat: 'Forests and grasslands',
      height: '1.1 m',
      weight: '30.0 kg',
      category: 'Bird Pokémon'
    },
    { 
      id: 18, 
      name: 'Pidgeot', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Normal', 'Flying'],
      description: 'When hunting, it skims the surface of water at high speed to pick off unwary prey such as Magikarp.',
      habitat: 'Forests and grasslands',
      height: '1.5 m',
      weight: '39.5 kg',
      category: 'Bird Pokémon'
    },
    { 
      id: 19, 
      name: 'Rattata', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Normal'],
      description: 'Bites anything when it attacks. Small and very quick, it is a common sight in many places.',
      habitat: 'Urban areas and grasslands',
      height: '0.3 m',
      weight: '3.5 kg',
      category: 'Mouse Pokémon'
    },
    { 
      id: 20, 
      name: 'Raticate', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Normal'],
      description: 'It uses its whiskers to maintain its balance. It apparently slows down if they are cut off.',
      habitat: 'Urban areas and grasslands',
      height: '0.7 m',
      weight: '18.5 kg',
      category: 'Mouse Pokémon'
    },
    { 
      id: 21, 
      name: 'Spearow', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Normal', 'Flying'],
      description: 'Eats bugs in grassy areas. It has to flap its short wings at high speed to stay airborne.',
      habitat: 'Grasslands and forests',
      height: '0.3 m',
      weight: '2.0 kg',
      category: 'Tiny Bird Pokémon'
    },
    { 
      id: 22, 
      name: 'Fearow', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Normal', 'Flying'],
      description: 'With its huge and magnificent wings, it can keep aloft without ever having to land for rest.',
      habitat: 'Grasslands and forests',
      height: '1.2 m',
      weight: '38.0 kg',
      category: 'Beak Pokémon'
    },
    { 
      id: 23, 
      name: 'Ekans', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Poison'],
      description: 'Moves silently and stealthily. Eats the eggs of birds, such as Pidgey and Spearow, whole.',
      habitat: 'Grasslands and forests',
      height: '2.0 m',
      weight: '6.9 kg',
      category: 'Snake Pokémon'
    },
    { 
      id: 24, 
      name: 'Arbok', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Poison'],
      description: 'It is rumored that the ferocious warning markings on its belly differ from area to area.',
      habitat: 'Grasslands and forests',
      height: '3.5 m',
      weight: '65.0 kg',
      category: 'Cobra Pokémon'
    },
    { 
      id: 25, 
      name: 'Pikachu', 
      status: 'seen', 
      isCaught: false, 
      isEncountered: true,
      types: ['Electric'],
      description: 'When several of these Pokémon gather, their electricity can cause lightning storms.',
      habitat: 'Forests and grasslands',
      height: '0.4 m',
      weight: '6.0 kg',
      category: 'Mouse Pokémon'
    },
          { 
        id: 26, 
        name: 'Raichu', 
        status: 'seen', 
        isCaught: false, 
        isEncountered: true,
        types: ['Electric'],
        description: 'Its long tail serves as a ground to protect itself from its own electrical power.',
        habitat: 'Forests and grasslands',
        height: '0.8 m',
        weight: '30.0 kg',
        category: 'Mouse Pokémon'
      },
      { 
        id: 27, 
        name: 'Sandshrew', 
        status: 'unknown', 
        isCaught: false, 
        isEncountered: false,
        types: ['Ground'],
        description: 'Burrows deep underground in arid locations far from water. It only emerges to hunt for food.',
        habitat: 'Deserts and caves',
        height: '0.6 m',
        weight: '12.0 kg',
        category: 'Mouse Pokémon'
      },
    { id: 28, name: 'Sandslash', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ground'], description: 'Curls up into a spiny ball when threatened. It can roll while curled up to attack or escape.', habitat: 'Deserts and caves', height: '1.0 m', weight: '29.5 kg', category: 'Mouse Pokémon' },
    { id: 29, name: 'Nidoran♀', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison'], description: 'Although small, its venomous barbs can protect it. From generation to generation, it never stops growing.', habitat: 'Grasslands and forests', height: '0.4 m', weight: '7.0 kg', category: 'Poison Pin Pokémon' },
    { id: 30, name: 'Nidorina', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison'], description: 'When it senses danger, it raises all the barbs on its body. These barbs secrete a potent venom.', habitat: 'Grasslands and forests', height: '0.8 m', weight: '20.0 kg', category: 'Poison Pin Pokémon' },
    { id: 31, name: 'Nidoqueen', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison', 'Ground'], description: 'Its hard scales provide strong protection. It uses its thick bulk to execute powerful moves.', habitat: 'Grasslands and forests', height: '1.3 m', weight: '60.0 kg', category: 'Drill Pokémon' },
    { id: 32, name: 'Nidoran♂', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison'], description: 'Stiffens its ears to sense danger. The larger its horns, the more powerful its secreted venom.', habitat: 'Grasslands and forests', height: '0.5 m', weight: '9.0 kg', category: 'Poison Pin Pokémon' },
    { id: 33, name: 'Nidorino', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison'], description: 'An aggressive Pokémon that is quick to attack. The horn on its head secretes a powerful venom.', habitat: 'Grasslands and forests', height: '0.9 m', weight: '19.5 kg', category: 'Poison Pin Pokémon' },
    { id: 34, name: 'Nidoking', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison', 'Ground'], description: 'It uses its powerful tail in battle to smash, constrict, then break the prey\'s bones.', habitat: 'Grasslands and forests', height: '1.4 m', weight: '62.0 kg', category: 'Drill Pokémon' },
    { id: 35, name: 'Clefairy', status: 'unknown', isCaught: false, isEncountered: false, types: ['Fairy'], description: 'Its magical and cute appeal has many admirers. It is rare and found only in certain areas.', habitat: 'Mountains and caves', height: '0.6 m', weight: '7.5 kg', category: 'Fairy Pokémon' },
    { id: 36, name: 'Clefable', status: 'unknown', isCaught: false, isEncountered: false, types: ['Fairy'], description: 'A timid fairy Pokémon that is rarely seen by people. Some believe that it only appears to a person who is pure of heart.', habitat: 'Mountains and caves', height: '1.3 m', weight: '40.0 kg', category: 'Fairy Pokémon' },
    { id: 37, name: 'Vulpix', status: 'seen', isCaught: false, isEncountered: true, types: ['Fire'], description: 'At the time of birth, it has just one tail. The tail splits from its tip as it grows older.', habitat: 'Mountain ranges and caves', height: '0.6 m', weight: '9.9 kg', category: 'Fox Pokémon' },
    { id: 38, name: 'Ninetales', status: 'unknown', isCaught: false, isEncountered: false, types: ['Fire'], description: 'Very smart and very vengeful. Grabbing one of its many tails could result in a 1000-year curse.', habitat: 'Mountain ranges and caves', height: '1.1 m', weight: '19.9 kg', category: 'Fox Pokémon' },
    { id: 39, name: 'Jigglypuff', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal', 'Fairy'], description: 'When its huge eyes light up, it sings a mysteriously soothing melody that lulls its enemies to sleep.', habitat: 'Grasslands and forests', height: '0.5 m', weight: '5.5 kg', category: 'Balloon Pokémon' },
    { id: 40, name: 'Wigglytuff', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal', 'Fairy'], description: 'The body is soft and rubbery. When angered, it will suck in air and inflate itself to an enormous size.', habitat: 'Grasslands and forests', height: '1.0 m', weight: '12.0 kg', category: 'Balloon Pokémon' },
    { id: 41, name: 'Zubat', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison', 'Flying'], description: 'Forms colonies in perpetually dark places. Uses ultrasonic waves to identify and approach targets.', habitat: 'Caves and dark places', height: '0.8 m', weight: '7.5 kg', category: 'Bat Pokémon' },
    { id: 42, name: 'Golbat', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison', 'Flying'], description: 'Once it strikes, it will not stop draining energy from the victim even if it gets too heavy to fly.', habitat: 'Caves and dark places', height: '1.6 m', weight: '55.0 kg', category: 'Bat Pokémon' },
    { id: 43, name: 'Oddish', status: 'seen', isCaught: false, isEncountered: true, types: ['Grass', 'Poison'], description: 'During the day, it keeps its face buried in the ground. At night, it wanders around sowing its seeds.', habitat: 'Forests and grasslands', height: '0.5 m', weight: '5.4 kg', category: 'Weed Pokémon' },
    { id: 44, name: 'Gloom', status: 'seen', isCaught: false, isEncountered: false, types: ['Grass', 'Poison'], description: 'The fluid that oozes from its mouth isn\'t drool. It is a nectar that is used to attract prey.', habitat: 'Forests and grasslands', height: '0.8 m', weight: '8.6 kg', category: 'Weed Pokémon' },
    { id: 45, name: 'Vileplume', status: 'unknown', isCaught: false, isEncountered: false, types: ['Grass', 'Poison'], description: 'The larger its petals, the more toxic pollen it contains. Its big head is heavy and hard to hold up.', habitat: 'Forests and grasslands', height: '1.2 m', weight: '18.6 kg', category: 'Flower Pokémon' },
    { id: 46, name: 'Paras', status: 'unknown', isCaught: false, isEncountered: false, types: ['Bug', 'Grass'], description: 'Burrows to suck tree roots. The mushrooms on its back grow by drawing nutrients from the bug host.', habitat: 'Forests and grasslands', height: '0.3 m', weight: '5.4 kg', category: 'Mushroom Pokémon' },
    { id: 47, name: 'Parasect', status: 'unknown', isCaught: false, isEncountered: false, types: ['Bug', 'Grass'], description: 'A host-parasite pair in which the parasite mushroom has taken over the host bug. Prefers damp places.', habitat: 'Forests and grasslands', height: '1.0 m', weight: '29.5 kg', category: 'Mushroom Pokémon' },
    { id: 48, name: 'Venonat', status: 'seen', isCaught: false, isEncountered: true, types: ['Bug', 'Poison'], description: 'Lives in the shadows of tall trees where it eats insects. It is attracted by light at night.', habitat: 'Forests and grasslands', height: '1.0 m', weight: '30.0 kg', category: 'Insect Pokémon' },
    { id: 49, name: 'Venomoth', status: 'unknown', isCaught: false, isEncountered: false, types: ['Bug', 'Poison'], description: 'The powdery scales on its wings are hard to remove from skin. They also contain poison that leaks out on contact.', habitat: 'Forests and grasslands', height: '1.5 m', weight: '12.5 kg', category: 'Poison Moth Pokémon' },
    { id: 50, name: 'Diglett', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ground'], description: 'Lives about one yard underground where it feeds on plant roots. It sometimes appears above ground.', habitat: 'Caves and underground', height: '0.2 m', weight: '0.8 kg', category: 'Mole Pokémon' },
    { id: 51, name: 'Dugtrio', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ground'], description: 'A team of Diglett triplets. It triggers huge earthquakes by burrowing 60 miles underground.', habitat: 'Caves and underground', height: '0.7 m', weight: '33.3 kg', category: 'Mole Pokémon' },
    { id: 52, name: 'Meowth', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal'], description: 'Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change.', habitat: 'Urban areas', height: '0.4 m', weight: '4.2 kg', category: 'Scratch Cat Pokémon' },
    { id: 53, name: 'Persian', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal'], description: 'Although its fur has many admirers, it is tough to raise as a pet because of its fickle meanness.', habitat: 'Urban areas', height: '1.0 m', weight: '32.0 kg', category: 'Classy Cat Pokémon' },
    { id: 54, name: 'Psyduck', status: 'seen', isCaught: false, isEncountered: true, types: ['Water'], description: 'Constantly troubled by headaches. It uses psychic powers when its head hurts.', habitat: 'Oceans and lakes', height: '0.8 m', weight: '19.6 kg', category: 'Duck Pokémon' },
    { id: 55, name: 'Golduck', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'Often seen swimming elegantly by lake shores. It is always bothered by headaches.', habitat: 'Oceans and lakes', height: '1.7 m', weight: '76.6 kg', category: 'Duck Pokémon' },
    { id: 56, name: 'Mankey', status: 'seen', isCaught: false, isEncountered: true, types: ['Fighting'], description: 'Extremely quick to anger. It could be docile one moment then thrashing away the next instant.', habitat: 'Mountain ranges and forests', height: '0.5 m', weight: '28.0 kg', category: 'Pig Monkey Pokémon' },
    { id: 57, name: 'Primeape', status: 'unknown', isCaught: false, isEncountered: false, types: ['Fighting'], description: 'Always furious and tenacious to the extreme. Anger is said to make it even stronger.', habitat: 'Mountain ranges and forests', height: '1.0 m', weight: '32.0 kg', category: 'Pig Monkey Pokémon' },
    { id: 58, name: 'Growlithe', status: 'seen', isCaught: false, isEncountered: true, types: ['Fire'], description: 'Very protective of its territory. It will bark and bite to repel intruders from its space.', habitat: 'Mountain ranges and grasslands', height: '0.7 m', weight: '19.0 kg', category: 'Puppy Pokémon' },
    { id: 59, name: 'Arcanine', status: 'seen', isCaught: false, isEncountered: true, types: ['Fire'], description: 'A Pokémon that has been admired since the past for its beauty. It runs agilely as if on wings.', habitat: 'Mountain ranges and grasslands', height: '1.9 m', weight: '155.0 kg', category: 'Legendary Pokémon' },
    { id: 60, name: 'Poliwag', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'Its newly born legs don\'t have strength yet, so it stands unsteadily. However, it can swim from birth.', habitat: 'Oceans and lakes', height: '0.6 m', weight: '12.4 kg', category: 'Tadpole Pokémon' },
    { id: 61, name: 'Poliwhirl', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'Capable of living in or out of water. When out of water, it sweats to keep its body slimy.', habitat: 'Oceans and lakes', height: '1.0 m', weight: '20.0 kg', category: 'Tadpole Pokémon' },
    { id: 62, name: 'Poliwrath', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water', 'Fighting'], description: 'An adept swimmer at both the front crawl and breast stroke. Easily overtakes the best human swimmers.', habitat: 'Oceans and lakes', height: '1.3 m', weight: '54.0 kg', category: 'Tadpole Pokémon' },
    { id: 63, name: 'Abra', status: 'seen', isCaught: false, isEncountered: true, types: ['Psychic'], description: 'Using its ability to read minds, it will identify impending danger and teleport to safety.', habitat: 'Urban areas and grasslands', height: '0.9 m', weight: '19.5 kg', category: 'Psi Pokémon' },
    { id: 64, name: 'Kadabra', status: 'unknown', isCaught: false, isEncountered: false, types: ['Psychic'], description: 'It emits special alpha waves from its body that induce headaches just by being nearby.', habitat: 'Urban areas and grasslands', height: '1.3 m', weight: '56.5 kg', category: 'Psi Pokémon' },
    { id: 65, name: 'Alakazam', status: 'unknown', isCaught: false, isEncountered: false, types: ['Psychic'], description: 'Its brain can outperform a supercomputer. Its IQ is said to be around 5,000.', habitat: 'Urban areas and grasslands', height: '1.5 m', weight: '48.0 kg', category: 'Psi Pokémon' },
    { id: 66, name: 'Machop', status: 'seen', isCaught: false, isEncountered: true, types: ['Fighting'], description: 'Loves to build its muscles. It trains in all styles of martial arts to become even stronger.', habitat: 'Mountain ranges and caves', height: '0.8 m', weight: '19.5 kg', category: 'Superpower Pokémon' },
    { id: 67, name: 'Machoke', status: 'seen', isCaught: false, isEncountered: true, types: ['Fighting'], description: 'Its muscular body is so powerful, it must wear a power save belt to be able to regulate its motions.', habitat: 'Mountain ranges and caves', height: '1.5 m', weight: '70.5 kg', category: 'Superpower Pokémon' },
    { id: 68, name: 'Machamp', status: 'unknown', isCaught: false, isEncountered: false, types: ['Fighting'], description: 'Using its heavy muscles, it throws powerful punches that can send the victim clear over the horizon.', habitat: 'Mountain ranges and caves', height: '1.6 m', weight: '130.0 kg', category: 'Superpower Pokémon' },
    { id: 69, name: 'Bellsprout', status: 'unknown', isCaught: false, isEncountered: false, types: ['Grass', 'Poison'], description: 'A carnivorous Pokémon that traps and eats bugs. It uses its root feet to soak up needed moisture.', habitat: 'Forests and grasslands', height: '0.7 m', weight: '4.0 kg', category: 'Flower Pokémon' },
    { id: 70, name: 'Weepinbell', status: 'unknown', isCaught: false, isEncountered: false, types: ['Grass', 'Poison'], description: 'It spits out poisonpowder to immobilize the enemy and then finishes it with a spray of acid.', habitat: 'Forests and grasslands', height: '1.0 m', weight: '6.4 kg', category: 'Flycatcher Pokémon' },
    { id: 71, name: 'Victreebel', status: 'unknown', isCaught: false, isEncountered: false, types: ['Grass', 'Poison'], description: 'Said to live in huge colonies deep in jungles, although no one has ever returned from there.', habitat: 'Forests and jungles', height: '1.7 m', weight: '15.5 kg', category: 'Flycatcher Pokémon' },
    { id: 72, name: 'Tentacool', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water', 'Poison'], description: 'Drifts in shallow seas. Anglers who hook them by accident are often punished by its stinging acid.', habitat: 'Oceans and beaches', height: '0.9 m', weight: '45.5 kg', category: 'Jellyfish Pokémon' },
    { id: 73, name: 'Tentacruel', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water', 'Poison'], description: 'The tentacles are normally kept short. On hunts, they are extended to ensnare fleeing prey.', habitat: 'Oceans and beaches', height: '1.6 m', weight: '55.0 kg', category: 'Jellyfish Pokémon' },
    { id: 74, name: 'Geodude', status: 'unknown', isCaught: false, isEncountered: false, types: ['Rock', 'Ground'], description: 'Found in fields and mountains. Mistaking them for boulders, people often step or trip on them.', habitat: 'Mountain ranges and caves', height: '0.4 m', weight: '20.0 kg', category: 'Rock Pokémon' },
    { id: 75, name: 'Graveler', status: 'unknown', isCaught: false, isEncountered: false, types: ['Rock', 'Ground'], description: 'Rolls down slopes to move. It rolls over any obstacle without slowing or changing its direction.', habitat: 'Mountain ranges and caves', height: '1.0 m', weight: '105.0 kg', category: 'Rock Pokémon' },
    { id: 76, name: 'Golem', status: 'unknown', isCaught: false, isEncountered: false, types: ['Rock', 'Ground'], description: 'Its boulder-like body is extremely hard. It can easily withstand dynamite blasts without damage.', habitat: 'Mountain ranges and caves', height: '1.4 m', weight: '300.0 kg', category: 'Megaton Pokémon' },
    { id: 77, name: 'Ponyta', status: 'seen', isCaught: false, isEncountered: true, types: ['Fire'], description: 'Its hooves are 10 times harder than diamonds. It can trample anything completely flat in little time.', habitat: 'Grasslands and plains', height: '1.0 m', weight: '30.0 kg', category: 'Fire Horse Pokémon' },
    { id: 78, name: 'Rapidash', status: 'seen', isCaught: false, isEncountered: true, types: ['Fire'], description: 'Very competitive, this Pokémon will chase anything that moves fast in the hopes of racing it.', habitat: 'Grasslands and plains', height: '1.7 m', weight: '95.0 kg', category: 'Fire Horse Pokémon' },
    { id: 79, name: 'Slowpoke', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water', 'Psychic'], description: 'Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack.', habitat: 'Oceans and lakes', height: '1.2 m', weight: '36.0 kg', category: 'Dopey Pokémon' },
    { id: 80, name: 'Slowbro', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water', 'Psychic'], description: 'The Shellder that latches onto Slowpoke\'s tail is said to feed on the host\'s left-over scraps.', habitat: 'Oceans and lakes', height: '1.6 m', weight: '78.5 kg', category: 'Hermit Crab Pokémon' },
    { id: 81, name: 'Magnemite', status: 'seen', isCaught: false, isEncountered: true, types: ['Electric', 'Steel'], description: 'Uses anti-gravity to stay suspended. Appears without warning and uses Thunder Wave and similar moves.', habitat: 'Urban areas and power plants', height: '0.3 m', weight: '6.0 kg', category: 'Magnet Pokémon' },
    { id: 82, name: 'Magneton', status: 'unknown', isCaught: false, isEncountered: false, types: ['Electric', 'Steel'], description: 'Formed by several Magnemite linked together. They frequently appear when sunspots flare up.', habitat: 'Urban areas and power plants', height: '1.0 m', weight: '60.0 kg', category: 'Magnet Pokémon' },
    { id: 83, name: 'Farfetch\'d', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal', 'Flying'], description: 'The plant stalk it holds is its weapon. This stalk is used like a sword to cut all sorts of things.', habitat: 'Grasslands and forests', height: '0.8 m', weight: '15.0 kg', category: 'Wild Duck Pokémon' },
    { id: 84, name: 'Doduo', status: 'seen', isCaught: false, isEncountered: true, types: ['Normal', 'Flying'], description: 'A bird that makes up for its poor flying with its fast foot speed. Leaves giant footprints.', habitat: 'Grasslands and plains', height: '1.4 m', weight: '39.2 kg', category: 'Twin Bird Pokémon' },
    { id: 85, name: 'Dodrio', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal', 'Flying'], description: 'Uses its three brains to execute complex plans. While two heads sleep, one head stays awake.', habitat: 'Grasslands and plains', height: '1.8 m', weight: '85.2 kg', category: 'Triple Bird Pokémon' },
    { id: 86, name: 'Seel', status: 'seen', isCaught: false, isEncountered: true, types: ['Water'], description: 'The protruding horn on its head is very hard. It is used for bashing through thick ice.', habitat: 'Oceans and ice floes', height: '1.1 m', weight: '90.0 kg', category: 'Sea Lion Pokémon' },
    { id: 87, name: 'Dewgong', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water', 'Ice'], description: 'Stores thermal energy in its body. Swims at a steady 8 knots even in intensely cold waters.', habitat: 'Oceans and ice floes', height: '1.7 m', weight: '120.0 kg', category: 'Sea Lion Pokémon' },
    { id: 88, name: 'Grimer', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison'], description: 'Appears in filthy areas. Thrives by sucking up polluted sludge that is pumped out of factories.', habitat: 'Urban areas and wastelands', height: '0.9 m', weight: '30.0 kg', category: 'Sludge Pokémon' },
    { id: 89, name: 'Muk', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison'], description: 'Thickly covered with a filthy, vile sludge. It is so toxic, even its footprints contain poison.', habitat: 'Urban areas and wastelands', height: '1.2 m', weight: '30.0 kg', category: 'Sludge Pokémon' },
    { id: 90, name: 'Shellder', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'Its hard shell repels any kind of attack. It is vulnerable only when its shell is open.', habitat: 'Oceans and beaches', height: '0.3 m', weight: '4.0 kg', category: 'Bivalve Pokémon' },
    { id: 91, name: 'Cloyster', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water', 'Ice'], description: 'When attacked, it launches its horns in quick volleys. Its innards have never been seen.', habitat: 'Oceans and beaches', height: '1.5 m', weight: '132.5 kg', category: 'Bivalve Pokémon' },
    { id: 92, name: 'Gastly', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ghost', 'Poison'], description: 'Almost invisible, this gaseous Pokémon cloaks the target and puts it to sleep without notice.', habitat: 'Caves and dark places', height: '1.3 m', weight: '0.1 kg', category: 'Gas Pokémon' },
    { id: 93, name: 'Haunter', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ghost', 'Poison'], description: 'Because of its ability to slip through block walls, it is said to be from another dimension.', habitat: 'Caves and dark places', height: '1.6 m', weight: '0.1 kg', category: 'Gas Pokémon' },
    { id: 94, name: 'Gengar', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ghost', 'Poison'], description: 'On the night of a full moon, if shadows move on their own and laugh, it must be Gengar\'s doing.', habitat: 'Caves and dark places', height: '1.5 m', weight: '40.5 kg', category: 'Shadow Pokémon' },
    { id: 95, name: 'Onix', status: 'seen', isCaught: false, isEncountered: true, types: ['Rock', 'Ground'], description: 'As it grows older, its body becomes increasingly rounder and smoother.', habitat: 'Mountain ranges and caves', height: '8.8 m', weight: '210.0 kg', category: 'Rock Snake Pokémon' },
    { id: 96, name: 'Drowzee', status: 'seen', isCaught: false, isEncountered: true, types: ['Psychic'], description: 'Puts enemies to sleep then eats their dreams. According to elderly people, children who sleep with Drowzee in dark rooms may go missing.', habitat: 'Urban areas and grasslands', height: '1.0 m', weight: '32.4 kg', category: 'Hypnosis Pokémon' },
    { id: 97, name: 'Hypno', status: 'unknown', isCaught: false, isEncountered: false, types: ['Psychic'], description: 'When it locks eyes with an enemy, it will use a mix of PSI moves such as Hypnosis and Confusion.', habitat: 'Urban areas and grasslands', height: '1.6 m', weight: '75.6 kg', category: 'Hypnosis Pokémon' },
    { id: 98, name: 'Krabby', status: 'seen', isCaught: false, isEncountered: true, types: ['Water'], description: 'Its pincers are not only powerful weapons, they are used for balance when walking sideways.', habitat: 'Oceans and beaches', height: '0.4 m', weight: '6.5 kg', category: 'River Crab Pokémon' },
    { id: 99, name: 'Kingler', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'The large pincer has 10,000-horsepower strength. However, it is so heavy, it is difficult to aim.', habitat: 'Oceans and beaches', height: '1.3 m', weight: '60.0 kg', category: 'Pincer Pokémon' },
    { id: 100, name: 'Voltorb', status: 'unknown', isCaught: false, isEncountered: false, types: ['Electric'], description: 'Usually found in power plants. Easily mistaken for a Poké Ball, it has zapped many people.', habitat: 'Power plants and urban areas', height: '0.5 m', weight: '10.4 kg', category: 'Ball Pokémon' },
    { id: 101, name: 'Electrode', status: 'unknown', isCaught: false, isEncountered: false, types: ['Electric'], description: 'It stores electric energy under very high pressure. It often explodes with little or no provocation.', habitat: 'Power plants and urban areas', height: '1.2 m', weight: '66.6 kg', category: 'Ball Pokémon' },
    { id: 102, name: 'Exeggcute', status: 'unknown', isCaught: false, isEncountered: false, types: ['Grass', 'Psychic'], description: 'Often mistaken for eggs. When disturbed, they quickly gather and attack in swarms.', habitat: 'Forests and grasslands', height: '0.4 m', weight: '2.5 kg', category: 'Egg Pokémon' },
    { id: 103, name: 'Exeggutor', status: 'unknown', isCaught: false, isEncountered: false, types: ['Grass', 'Psychic'], description: 'Legend has it that on rare occasions, one of its heads will drop off and continue on as an Exeggcute.', habitat: 'Forests and grasslands', height: '2.0 m', weight: '120.0 kg', category: 'Coconut Pokémon' },
    { id: 104, name: 'Cubone', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ground'], description: 'Because it never removes its skull helmet, no one has ever seen this Pokémon\'s real face.', habitat: 'Mountain ranges and caves', height: '0.4 m', weight: '6.5 kg', category: 'Lonely Pokémon' },
    { id: 105, name: 'Marowak', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ground'], description: 'The bone it holds is its key weapon. It throws the bone skillfully like a boomerang to KO targets.', habitat: 'Mountain ranges and caves', height: '1.0 m', weight: '45.0 kg', category: 'Bone Keeper Pokémon' },
    { id: 106, name: 'Hitmonlee', status: 'unknown', isCaught: false, isEncountered: false, types: ['Fighting'], description: 'When in a hurry, its legs lengthen progressively. It runs smoothly with extra long, loping strides.', habitat: 'Urban areas and dojos', height: '1.5 m', weight: '49.8 kg', category: 'Kicking Pokémon' },
    { id: 107, name: 'Hitmonchan', status: 'unknown', isCaught: false, isEncountered: false, types: ['Fighting'], description: 'While apparently doing nothing, it fires punches in lightning-fast volleys that are impossible to see.', habitat: 'Urban areas and dojos', height: '1.4 m', weight: '50.2 kg', category: 'Punching Pokémon' },
    { id: 108, name: 'Lickitung', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal'], description: 'Its tongue can be extended like a chameleon\'s. It leaves a tingling sensation when it licks enemies.', habitat: 'Grasslands and forests', height: '1.2 m', weight: '65.5 kg', category: 'Licking Pokémon' },
    { id: 109, name: 'Koffing', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison'], description: 'Because it stores several kinds of toxic gases in its body, it is prone to exploding without warning.', habitat: 'Urban areas and wastelands', height: '0.6 m', weight: '1.0 kg', category: 'Poison Gas Pokémon' },
    { id: 110, name: 'Weezing', status: 'unknown', isCaught: false, isEncountered: false, types: ['Poison'], description: 'Where two kinds of poison gases meet, 2 Koffings can breed into a Weezing over many years.', habitat: 'Urban areas and wastelands', height: '1.2 m', weight: '9.5 kg', category: 'Poison Gas Pokémon' },
    { id: 111, name: 'Rhyhorn', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ground', 'Rock'], description: 'Its massive bones are 1000 times harder than human bones. It can easily knock a trailer flying.', habitat: 'Mountain ranges and grasslands', height: '1.0 m', weight: '115.0 kg', category: 'Spikes Pokémon' },
    { id: 112, name: 'Rhydon', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ground', 'Rock'], description: 'Protected by an armor-like hide, it is capable of living in molten lava of 3,600 degrees.', habitat: 'Mountain ranges and grasslands', height: '1.9 m', weight: '120.0 kg', category: 'Drill Pokémon' },
    { id: 113, name: 'Chansey', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal'], description: 'A rare and elusive Pokémon that is said to bring happiness to those who manage to catch it.', habitat: 'Grasslands and forests', height: '1.1 m', weight: '34.6 kg', category: 'Egg Pokémon' },
    { id: 114, name: 'Tangela', status: 'unknown', isCaught: false, isEncountered: false, types: ['Grass'], description: 'The whole body is swathed with wide vines that are similar to seaweed. Its vines shake as it walks.', habitat: 'Forests and grasslands', height: '1.0 m', weight: '35.0 kg', category: 'Vine Pokémon' },
    { id: 115, name: 'Kangaskhan', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal'], description: 'The infant rarely ventures out of its mother\'s protective pouch until it is 3 years old.', habitat: 'Grasslands and forests', height: '2.2 m', weight: '80.0 kg', category: 'Parent Pokémon' },
    { id: 116, name: 'Horsea', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'Known to shoot down flying bugs with precision blasts of ink from the surface of the water.', habitat: 'Oceans and lakes', height: '0.4 m', weight: '8.0 kg', category: 'Dragon Pokémon' },
    { id: 117, name: 'Seadra', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'Capable of swimming backwards by rapidly flapping its wing-like pectoral fins and stout tail.', habitat: 'Oceans and lakes', height: '1.2 m', weight: '25.0 kg', category: 'Dragon Pokémon' },
    { id: 118, name: 'Goldeen', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'Its tail fin billows like an elegant ballroom dress, giving it the nickname of the Water Queen.', habitat: 'Oceans and lakes', height: '0.6 m', weight: '15.0 kg', category: 'Goldfish Pokémon' },
    { id: 119, name: 'Seaking', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'In the autumn spawning season, they can be seen swimming vigorously up rivers and streams.', habitat: 'Oceans and lakes', height: '1.3 m', weight: '39.0 kg', category: 'Goldfish Pokémon' },
    { id: 120, name: 'Staryu', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'An enigmatic Pokémon that can effortlessly regenerate any appendage it loses in battle.', habitat: 'Oceans and beaches', height: '0.8 m', weight: '34.5 kg', category: 'Star Shape Pokémon' },
    { id: 121, name: 'Starmie', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water', 'Psychic'], description: 'Its central core glows with the seven colors of the rainbow. Some people value the core as a gem.', habitat: 'Oceans and beaches', height: '1.1 m', weight: '80.0 kg', category: 'Mysterious Pokémon' },
    { id: 122, name: 'Mr. Mime', status: 'unknown', isCaught: false, isEncountered: false, types: ['Psychic', 'Fairy'], description: 'A master of pantomime. Its gestures and motions convince watchers that something unseeable actually exists.', habitat: 'Urban areas and grasslands', height: '1.3 m', weight: '54.5 kg', category: 'Barrier Pokémon' },
    { id: 123, name: 'Scyther', status: 'unknown', isCaught: false, isEncountered: false, types: ['Bug', 'Flying'], description: 'With ninja-like agility and speed, it can create the illusion that there is more than one.', habitat: 'Forests and grasslands', height: '1.5 m', weight: '56.0 kg', category: 'Mantis Pokémon' },
    { id: 124, name: 'Jynx', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ice', 'Psychic'], description: 'It seductively wiggles its hips as it walks. It can cause people to dance in unison with it.', habitat: 'Mountains and ice floes', height: '1.4 m', weight: '40.6 kg', category: 'Human Shape Pokémon' },
    { id: 125, name: 'Electabuzz', status: 'unknown', isCaught: false, isEncountered: false, types: ['Electric'], description: 'Normally found near power plants, they can wander away and cause major blackouts in cities.', habitat: 'Power plants and urban areas', height: '1.1 m', weight: '30.0 kg', category: 'Electric Pokémon' },
    { id: 126, name: 'Magmar', status: 'unknown', isCaught: false, isEncountered: false, types: ['Fire'], description: 'Born in an active volcano. Its body is always cloaked in flames, so it can\'t be seen clearly.', habitat: 'Volcanoes and mountain ranges', height: '1.3 m', weight: '44.5 kg', category: 'Spitfire Pokémon' },
    { id: 127, name: 'Pinsir', status: 'unknown', isCaught: false, isEncountered: false, types: ['Bug'], description: 'If it fails to crush the victim in its pincers, it will swing it around and toss it hard.', habitat: 'Forests and grasslands', height: '1.5 m', weight: '55.0 kg', category: 'Stag Beetle Pokémon' },
    { id: 128, name: 'Tauros', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal'], description: 'When it targets an enemy, it charges furiously while whipping its body with its long tails.', habitat: 'Grasslands and plains', height: '1.4 m', weight: '88.4 kg', category: 'Wild Bull Pokémon' },
    { id: 129, name: 'Magikarp', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'In the distant past, it was somewhat stronger than the horribly weak descendants that exist today.', habitat: 'Oceans and lakes', height: '0.9 m', weight: '10.0 kg', category: 'Fish Pokémon' },
    { id: 130, name: 'Gyarados', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water', 'Flying'], description: 'Rarely seen in the wild. Huge and vicious, it is capable of destroying entire cities in a rage.', habitat: 'Oceans and lakes', height: '6.5 m', weight: '235.0 kg', category: 'Atrocious Pokémon' },
    { id: 131, name: 'Lapras', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water', 'Ice'], description: 'A gentle soul that can understand human speech. It ferries people across the sea on its back.', habitat: 'Oceans and ice floes', height: '2.5 m', weight: '220.0 kg', category: 'Transport Pokémon' },
    { id: 132, name: 'Ditto', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal'], description: 'It can transform into anything. When it sleeps, it changes into a stone to avoid being attacked.', habitat: 'Urban areas and grasslands', height: '0.3 m', weight: '4.0 kg', category: 'Transform Pokémon' },
    { id: 133, name: 'Eevee', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal'], description: 'Its irregularly configured DNA is affected by its surroundings. It evolves if its environment changes.', habitat: 'Urban areas and grasslands', height: '0.3 m', weight: '6.5 kg', category: 'Evolution Pokémon' },
    { id: 134, name: 'Vaporeon', status: 'unknown', isCaught: false, isEncountered: false, types: ['Water'], description: 'Lives close to water. Its long tail is ridged with a fin which is often mistaken for a mermaid\'s.', habitat: 'Oceans and lakes', height: '1.0 m', weight: '29.0 kg', category: 'Bubble Jet Pokémon' },
    { id: 135, name: 'Jolteon', status: 'unknown', isCaught: false, isEncountered: false, types: ['Electric'], description: 'It accumulates negative ions in the atmosphere to blast out 10000-volt lightning bolts.', habitat: 'Urban areas and grasslands', height: '0.8 m', weight: '24.5 kg', category: 'Lightning Pokémon' },
    { id: 136, name: 'Flareon', status: 'unknown', isCaught: false, isEncountered: false, types: ['Fire'], description: 'When storing thermal energy in its body, its temperature could soar to over 1600 degrees.', habitat: 'Mountain ranges and grasslands', height: '0.9 m', weight: '25.0 kg', category: 'Flame Pokémon' },
    { id: 137, name: 'Porygon', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal'], description: 'A Pokémon that consists entirely of programming code. It is capable of moving freely in cyberspace.', habitat: 'Digital space and urban areas', height: '0.8 m', weight: '36.5 kg', category: 'Virtual Pokémon' },
    { id: 138, name: 'Omanyte', status: 'unknown', isCaught: false, isEncountered: false, types: ['Rock', 'Water'], description: 'A prehistoric Pokémon that lived in the primordial sea, it swims by twisting its 10 tentacles about.', habitat: 'Oceans and ancient seas', height: '0.4 m', weight: '7.5 kg', category: 'Spiral Pokémon' },
    { id: 139, name: 'Omastar', status: 'unknown', isCaught: false, isEncountered: false, types: ['Rock', 'Water'], description: 'A prehistoric Pokémon that died out when its heavy shell made it impossible to catch prey.', habitat: 'Oceans and ancient seas', height: '1.0 m', weight: '35.0 kg', category: 'Spiral Pokémon' },
    { id: 140, name: 'Kabuto', status: 'unknown', isCaught: false, isEncountered: false, types: ['Rock', 'Water'], description: 'A Pokémon that was resurrected from a fossil found in what was once the ocean floor long ago.', habitat: 'Oceans and ancient seas', height: '0.5 m', weight: '11.5 kg', category: 'Shellfish Pokémon' },
    { id: 141, name: 'Kabutops', status: 'unknown', isCaught: false, isEncountered: false, types: ['Rock', 'Water'], description: 'In the water, it tucks in its limbs to become more compact, then it wiggles its shell to swim fast.', habitat: 'Oceans and ancient seas', height: '1.3 m', weight: '40.5 kg', category: 'Shellfish Pokémon' },
    { id: 142, name: 'Aerodactyl', status: 'unknown', isCaught: false, isEncountered: false, types: ['Rock', 'Flying'], description: 'A ferocious, prehistoric Pokémon that goes for the enemy\'s throat with its serrated saw-like fangs.', habitat: 'Mountain ranges and ancient skies', height: '1.8 m', weight: '59.0 kg', category: 'Fossil Pokémon' },
    { id: 143, name: 'Snorlax', status: 'unknown', isCaught: false, isEncountered: false, types: ['Normal'], description: 'Very lazy. Just eats and sleeps. As it grows older, it becomes more active. Its stomach is its strongest point.', habitat: 'Mountain ranges and forests', height: '2.1 m', weight: '460.0 kg', category: 'Sleeping Pokémon' },
    { id: 144, name: 'Articuno', status: 'unknown', isCaught: false, isEncountered: false, types: ['Ice', 'Flying'], description: 'A legendary bird Pokémon that is said to appear to doomed people who are lost in icy mountains.', habitat: 'Mountains and ice floes', height: '1.7 m', weight: '55.4 kg', category: 'Freeze Pokémon' },
    { id: 145, name: 'Zapdos', status: 'unknown', isCaught: false, isEncountered: false, types: ['Electric', 'Flying'], description: 'A legendary bird Pokémon that is said to appear from clouds while dropping enormous lightning bolts.', habitat: 'Mountain ranges and storm clouds', height: '1.6 m', weight: '52.6 kg', category: 'Electric Pokémon' },
    { id: 146, name: 'Moltres', status: 'unknown', isCaught: false, isEncountered: false, types: ['Fire', 'Flying'], description: 'A legendary bird Pokémon that is said to appear only to a trainer who has a pure heart.', habitat: 'Volcanoes and mountain ranges', height: '2.0 m', weight: '60.0 kg', category: 'Flame Pokémon' },
    { id: 147, name: 'Dratini', status: 'unknown', isCaught: false, isEncountered: false, types: ['Dragon'], description: 'Long considered a mythical Pokémon until recently when a small colony was discovered living underwater.', habitat: 'Oceans and lakes', height: '1.8 m', weight: '3.3 kg', category: 'Dragon Pokémon' },
    { id: 148, name: 'Dragonair', status: 'unknown', isCaught: false, isEncountered: false, types: ['Dragon'], description: 'A mystical Pokémon that exudes a gentle aura. Has the ability to change climate conditions.', habitat: 'Oceans and lakes', height: '4.0 m', weight: '16.5 kg', category: 'Dragon Pokémon' },
    { id: 149, name: 'Dragonite', status: 'unknown', isCaught: false, isEncountered: false, types: ['Dragon', 'Flying'], description: 'An extremely rarely seen marine Pokémon. Its intelligence is said to match that of humans.', habitat: 'Oceans and lakes', height: '2.2 m', weight: '210.0 kg', category: 'Dragon Pokémon' },
    { id: 150, name: 'Mewtwo', status: 'unknown', isCaught: false, isEncountered: false, types: ['Psychic'], description: 'Its DNA is almost the same as Mew\'s. However, its size and disposition are vastly different.', habitat: 'Laboratories and urban areas', height: '2.0 m', weight: '122.0 kg', category: 'Genetic Pokémon' },
    { id: 151, name: 'Mew', status: 'unknown', isCaught: false, isEncountered: false, types: ['Psychic'], description: 'So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide.', habitat: 'Unknown - extremely rare', height: '0.4 m', weight: '4.0 kg', category: 'New Species Pokémon' },
  ]);

  const selectedPokemonData = selectedPokemon ? pokemonList.find(p => p.id === selectedPokemon) : null;

  const seenCount = pokemonList.filter(p => p.isEncountered).length;
  const ownedCount = pokemonList.filter(p => p.isCaught).length;

  // Filter Pokemon based on search term
  const filteredPokemonList = useMemo(() => {
    if (!searchTerm.trim()) return pokemonList;
    return pokemonList.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pokemon.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pokemonList, searchTerm]);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedPokemon) return;
      
      const currentIndex = pokemonList.findIndex(p => p.id === selectedPokemon);
      
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (currentIndex > 0) {
            setSelectedPokemon(pokemonList[currentIndex - 1].id);
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (currentIndex < pokemonList.length - 1) {
            setSelectedPokemon(pokemonList[currentIndex + 1].id);
          }
          break;
        case 'Enter':
          event.preventDefault();
          if (!showDetailsOverlay) {
            setShowDetailsOverlay(true);
          }
          break;
        case 'Escape':
          if (showDetailsOverlay) {
            handleCloseDetails();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPokemon, showDetailsOverlay, pokemonList]);

  // Handle audio playback
  useEffect(() => {
    console.log('Audio effect triggered, isAudioEnabled:', isAudioEnabled);
    if (audioRef.current) {
      console.log('Audio ref is available');
      // Set audio properties for better compatibility
      audioRef.current.volume = 0.5;
      audioRef.current.preload = 'auto';
      
      if (isAudioEnabled) {
        // Don't try to autoplay - wait for user interaction
        console.log('Audio enabled, waiting for user interaction');
      } else {
        audioRef.current.pause();
        console.log('Audio paused');
      }
    } else {
      console.log('Audio ref not available yet');
    }
  }, [isAudioEnabled]);

  // Log when audio ref becomes available
  useEffect(() => {
    if (audioRef.current) {
      console.log('Audio ref mounted');
      console.log('Audio element:', audioRef.current);
      console.log('Audio src:', audioRef.current.src);
      
      // Set volume to 50% (0.5)
      audioRef.current.volume = volume;
      console.log('Audio volume set to 50%');
    }
  }, []);

  // Additional effect to handle audio loading and initial play
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isAudioEnabled) {
      console.log('Setting up audio event listeners');
      
      // Handle audio loading
      const handleCanPlay = () => {
        console.log('Audio can play');
        setIsAudioLoading(false);
        // Don't autoplay - wait for user interaction
      };

      const handleError = (error: Event) => {
        console.error('Audio error:', error);
        setIsAudioLoading(false);
      };

      const handleLoadStart = () => {
        console.log('Audio load started');
        setIsAudioLoading(true);
      };

      const handlePlay = () => {
        console.log('Audio started playing');
        setIsAudioPlaying(true);
      };

      const handlePause = () => {
        console.log('Audio paused');
        setIsAudioPlaying(false);
      };

      const handleEnded = () => {
        console.log('Audio ended');
        setIsAudioPlaying(false);
      };

      const handleLoadedData = () => {
        console.log('Audio loaded data');
      };

      const handleLoadedMetadata = () => {
        console.log('Audio loaded metadata');
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [isAudioEnabled]);

  const handlePokemonSelect = (id: number) => {
    // Save current scroll position before opening overlay
    if (pokemonListRef.current) {
      setScrollPosition(pokemonListRef.current.scrollTop);
    }
    setSelectedPokemon(id);
    setShowDetailsOverlay(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsOverlay(false);
    // Restore scroll position after overlay closes
    setTimeout(() => {
      if (pokemonListRef.current) {
        pokemonListRef.current.scrollTop = scrollPosition;
      }
    }, 0);
  };

  const togglePokemonStatus = (pokemonId: number, newStatus: 'owned' | 'seen' | 'unknown') => {
    setPokemonList(prevList => prevList.map(pokemon => {
      if (pokemon.id === pokemonId) {
        return {
          ...pokemon,
          status: newStatus,
          isCaught: newStatus === 'owned',
          isEncountered: newStatus !== 'unknown'
        };
      }
      return pokemon;
    }));
  };

  const toggleAudio = () => {
    if (isAudioEnabled) {
      // Disabling audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsAudioPlaying(false);
      setIsAudioEnabled(false);
    } else {
      // Enabling audio
      setIsAudioEnabled(true);
      // Automatically resume audio if it was playing before
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          console.log('Audio resumed after unmuting');
          setIsAudioPlaying(true);
        }).catch(error => {
          console.log('Audio resume failed after unmuting:', error);
        });
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      console.log('Volume changed to:', newVolume);
    }
  };





  // Handle starting the app and enabling audio
  const handleStartApp = () => {
    console.log('Starting Pokedex app...');
    
    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        
        // Hide loading modal and start audio
        setTimeout(() => {
          setShowLoadingModal(false);
          setIsLoading(false);
          
          // Start audio after user interaction
          if (audioRef.current && isAudioEnabled) {
            audioRef.current.play().then(() => {
              console.log('Audio started playing after app start');
              setIsAudioPlaying(true);
            }).catch(error => {
              console.log('Audio play failed after app start:', error);
            });
          }
        }, 500);
      }
      setLoadingProgress(progress);
    }, 100);
  };

  // Handle user interaction to enable audio
  const handleUserInteraction = () => {
    console.log('User interaction detected');
    console.log('Audio ref exists:', !!audioRef.current);
    console.log('Audio enabled:', isAudioEnabled);
    console.log('Audio playing:', isAudioPlaying);
    
    if (audioRef.current && isAudioEnabled && !isAudioPlaying) {
      console.log('Attempting to play audio...');
      audioRef.current.play().then(() => {
        console.log('Audio started playing on user interaction');
        setIsAudioPlaying(true);
      }).catch(error => {
        console.log('Audio play failed on user interaction:', error);
        console.error('Error details:', error);
      });
    } else {
      console.log('Audio play conditions not met');
    }
  };

  // Add click event listener to the entire pokedex container to enable audio on user interaction
  useEffect(() => {
    const container = document.querySelector('.pokedex-container');
    if (container) {
      container.addEventListener('click', handleUserInteraction);
      return () => container.removeEventListener('click', handleUserInteraction);
    }
  }, [isAudioEnabled]);

  return (
    <>
      {/* Loading Modal */}
      {showLoadingModal && (
        <div className="loading-modal-overlay">
          <div 
            className="loading-bg-container"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL || ''}/loading_bg.png)`
            }}
          ></div>
          <div className="loading-modal">
            <div className="loading-modal-header">
              <div className="pokedex-logo">
                <div className="pokedex-logo-circle">
                  <div className="pokedex-logo-inner">
                    <span className="pokedex-logo-text">P</span>
                  </div>
                </div>
              </div>
              <h1 className="loading-title">KANTO POKÉDEX</h1>
              <p className="loading-subtitle">Loading Pokemon Database...</p>
            </div>
            
            <div className="loading-progress-container">
              <div className="loading-progress-bar">
                <div 
                  className="loading-progress-fill" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <span className="loading-progress-text">{Math.round(loadingProgress)}%</span>
            </div>
            
            <div className="loading-pokemon">
              <div className="loading-pokemon-sprite"><img src={`${process.env.PUBLIC_URL || ''}/pokeball.png`} alt="Pokemon" /></div>
              <div className="loading-pokemon-trail">
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </div>
            </div>
            
            <button 
              className="start-app-button"
              onClick={handleStartApp}
              disabled={loadingProgress > 0}
            >
              {loadingProgress === 0 ? 'START POKÉDEX' : 'LOADING...'}
            </button>
            
            <div className="loading-tips">
              <p>💡 Tip: Click the START button to begin your Pokemon journey!</p>
              <p>🎵 Background music will play once you start exploring</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="pokedex-container">
      <div className="pokedex-header">
        <h1>KANTO POKÉDEX</h1>
        <div className="header-controls">
          <button 
            className="settings-button"
            onClick={() => setIsSettingsOpen(true)}
            title="Settings"
          >
            <img 
              src={`${process.env.PUBLIC_URL || ''}/settings.png`} 
              alt="Settings" 
              className="settings-icon"
            />
          </button>
        </div>
      </div>
      <div className="pokedex-body">
        <div className="pokedex-left-panel">
          <div className="pokemon-name-display">
            <div className="name-content">
              {selectedPokemonData?.isEncountered ? (selectedPokemonData?.name || 'Unknown') : '???'}
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
                {selectedPokemonData?.id === 1 && selectedPokemonData?.isEncountered && (
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
                {selectedPokemonData?.id === 2 && selectedPokemonData?.isEncountered && (
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
                {selectedPokemonData?.id === 4 && selectedPokemonData?.isEncountered && (
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
                      src="https://sketchfab.com/models/5c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
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

                {selectedPokemonData?.id === 26 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Raichu" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/d2d314d1f02a409a834cbb637b66f92a/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 26 loaded')}
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

                {selectedPokemonData?.id === 58 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Growlithe - Pokémon Super Mystery Dungeon" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/8e796b5972ff454e89ab4f1a94a838af/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 58 loaded')}
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

                {selectedPokemonData?.id === 59 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Arcanine" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/82c02a3bc6294f94b4423ae454a7b2aa/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 59 loaded')}
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

                {selectedPokemonData?.id === 133 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Eevee" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 133 loaded')}
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

                {/* New Pokemon 3D Models */}
                {selectedPokemonData?.id === 37 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Vulpix" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/e58822817c9948e7b101997e4cff7c1d/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 37 loaded')}
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

                {selectedPokemonData?.id === 43 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="0043-Oddish" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/32fd4824a1a442a3b2592ae0a85ff5c5/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 43 loaded')}
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

                {selectedPokemonData?.id === 44 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Gloom" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/50aeedd7a27f4de394f6dd75080f8d6c/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 44 loaded')}
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

                {selectedPokemonData?.id === 48 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Venonat" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/c162884e92304c12bad83122fca53282/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 48 loaded')}
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

                {/* New Pokemon 3D Models */}
                {selectedPokemonData?.id === 66 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Machop" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/d454660faf9a4b72aef248da8ab0d12b/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 66 loaded')}
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

                {selectedPokemonData?.id === 67 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Machoke" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/cbc862143600485c9d34b5e247d22aaa/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 67 loaded')}
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

                {selectedPokemonData?.id === 81 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Magnemite" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/dae3d444292e451ab41994410b90a8f8/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 81 loaded')}
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

                {selectedPokemonData?.id === 84 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Doduo" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/5d64e9e72dcf475c8fa64becf0412e64/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 84 loaded')}
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

                {selectedPokemonData?.id === 86 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Seel" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/d863b2e7888449af9b0a460056b3960e/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 86 loaded')}
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

                {selectedPokemonData?.id === 95 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Onix" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/aa904ceec53c490fbf6ab2a9738c5148/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 95 loaded')}
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

                {selectedPokemonData?.id === 96 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Drowzee" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/f43ed8aca6c64d47a45e9b050f022373/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 96 loaded')}
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

                {selectedPokemonData?.id === 98 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Krabby" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/7b0ca64599d84de987b52cac073b09a8/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 98 loaded')}
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

                {selectedPokemonData?.id === 54 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Psyduck" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/fb1fc117788d41c3840f90143095fc5f/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 54 loaded')}
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

                {selectedPokemonData?.id === 56 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Mankey" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/1f6bbb8582464a2c989cb9255846a20e/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 56 loaded')}
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

                {selectedPokemonData?.id === 63 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Abra" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/33299f8e3a9e4cd2b0717fd6c121c3c8/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 63 loaded')}
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

                {selectedPokemonData?.id === 77 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Ponyta - Pokemon" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/b8c7ba29095448b8a95dcbc940721d43/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 77 loaded')}
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

                {selectedPokemonData?.id === 78 && (
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title="Rapidash" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      src="https://sketchfab.com/models/9eddfe1733c447a48f3890459ce2acdc/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                      onLoad={() => console.log('Model 78 loaded')}
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

                {/* Placeholder Image for Other Pokemon or Unseen Pokemon */}
                {(!selectedPokemonData || !selectedPokemonData.isEncountered || ![1, 2, 4, 5, 7, 8, 9, 15, 16, 18, 20, 25, 26, 37, 43, 44, 48, 54, 56, 58, 59, 63, 66, 67, 77, 78, 81, 84, 86, 95, 96, 98, 133, 143, 144, 150].includes(selectedPokemonData.id)) && (
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
              {/*
              <div className="progress-container">
                <div className="progress-label">Pokedex Completion</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(ownedCount / pokemonList.length) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">{ownedCount}/{pokemonList.length} ({Math.round((ownedCount / pokemonList.length) * 100)}%)</div>
              </div>

              */}
              <div>Seen: {seenCount}</div>
              <div>Owned: {ownedCount}</div>
            </div>
          </div>
        </div>
        <div className="pokedex-right-panel">
          {showDetailsOverlay ? (
            <div className="pokemon-details-overlay">
              <div className="overlay-header">
                <h2>Pokemon Details</h2>
                <button className="close-button" onClick={handleCloseDetails}>
                  ✕
                </button>
              </div>
                               <div className="overlay-content">
                   <div className="pokemon-detail-item">
                     <span className="detail-label">ID:</span>
                     <span className="detail-value">{String(selectedPokemonData?.id).padStart(3, '0')}</span>
                   </div>
                   {selectedPokemonData?.isEncountered ? (
                     <>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Name:</span>
                         <span className="detail-value">{selectedPokemonData?.name || 'Unknown'}</span>
                       </div>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Category:</span>
                         <span className="detail-value">{selectedPokemonData?.category || 'Unknown'}</span>
                       </div>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Types:</span>
                         <div className="type-cards">
                           {selectedPokemonData?.types?.map((type, index) => (
                             <span key={index} className={`type-card type-${type.toLowerCase()}`}>
                               {type}
                             </span>
                           ))}
                         </div>
                       </div>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Height:</span>
                         <span className="detail-value">{selectedPokemonData?.height || 'Unknown'}</span>
                       </div>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Weight:</span>
                         <span className="detail-value">{selectedPokemonData?.weight || 'Unknown'}</span>
                       </div>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Habitat:</span>
                         <span className="detail-value">{selectedPokemonData?.habitat || 'Unknown'}</span>
                       </div>
                       <div className="pokemon-detail-item description-item">
                         <span className="detail-label">Description:</span>
                         <span className="detail-value">{selectedPokemonData?.description || 'No description available.'}</span>
                       </div>
                     </>
                   ) : (
                     <>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Name:</span>
                         <span className="detail-value">???</span>
                       </div>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Category:</span>
                         <span className="detail-value">???</span>
                       </div>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Types:</span>
                         <span className="detail-value">???</span>
                       </div>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Height:</span>
                         <span className="detail-value">???</span>
                       </div>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Weight:</span>
                         <span className="detail-value">???</span>
                       </div>
                       <div className="pokemon-detail-item">
                         <span className="detail-label">Habitat:</span>
                         <span className="detail-value">???</span>
                       </div>
                       <div className="pokemon-detail-item description-item">
                         <span className="detail-label">Description:</span>
                         <span className="detail-value">???</span>
                       </div>
                     </>
                   )}
                 </div>
            </div>
          ) : (
            <>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search Pokemon by name, type, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="pokemon-list" ref={pokemonListRef}>
                {filteredPokemonList.map((pokemon) => (
                  <PokemonItem
                    key={pokemon.id}
                    id={pokemon.id}
                    name={pokemon.name}
                    status={pokemon.status}
                    types={pokemon.types}
                    isSelected={pokemon.id === selectedPokemon}
                    onClick={() => handlePokemonSelect(pokemon.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Audio Element */}
      <audio 
        ref={audioRef}
        preload="auto"
        loop
        muted={!isAudioEnabled}
        onLoadStart={() => console.log('Audio loading started')}
        onCanPlay={() => console.log('Audio can play')}
        onError={(e) => console.error('Audio error:', e)}
      >
        <source src={`${process.env.PUBLIC_URL || ''}/pokemon_audio.mp3`} type="audio/mpeg" />
        <source src={`${process.env.PUBLIC_URL || ''}/pokemon_audio.mp3`} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* Settings Overlay */}
      {isSettingsOpen && (
        <div className="settings-overlay">
          <div className="settings-modal">
            <div className="settings-header">
              <h2>⚙️ Settings</h2>
              <button 
                className="close-settings-btn"
                onClick={() => setIsSettingsOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="settings-content">
              <div className="settings-section">
                <h3>🎵 Audio Settings</h3>
                <div className="setting-item">
                  <label htmlFor="volume-slider">Volume:</label>
                  <div className="volume-control">
                    <input
                      id="volume-slider"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="settings-volume-slider"
                    />
                    <span className="volume-value">{Math.round(volume * 100)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>🎵 Audio Settings</h3>
                <div className="setting-item">
                  <label htmlFor="auto-play-audio">Auto-play Audio:</label>
                  <div className="toggle-switch">
                    <input
                      id="auto-play-audio"
                      type="checkbox"
                      checked={autoPlayAudio}
                      onChange={(e) => setAutoPlayAudio(e.target.checked)}
                    />
                    <label htmlFor="auto-play-audio" className="toggle-label"></label>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>👁️ Display Settings</h3>
                <div className="setting-item">
                  <label htmlFor="show-numbers">Show Pokemon Numbers:</label>
                  <div className="toggle-switch">
                    <input
                      id="show-numbers"
                      type="checkbox"
                      checked={showPokemonNumbers}
                      onChange={(e) => setShowPokemonNumbers(e.target.checked)}
                    />
                    <label htmlFor="show-numbers" className="toggle-label"></label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label htmlFor="enable-animations">Enable Animations:</label>
                  <div className="toggle-switch">
                    <input
                      id="enable-animations"
                      type="checkbox"
                      checked={enableAnimations}
                      onChange={(e) => setEnableAnimations(e.target.checked)}
                    />
                    <label htmlFor="enable-animations" className="toggle-label"></label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label htmlFor="dark-mode">Dark Mode:</label>
                  <div className="toggle-switch">
                    <input
                      id="dark-mode"
                      type="checkbox"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <label htmlFor="dark-mode" className="toggle-label"></label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label htmlFor="compact-view">Compact View:</label>
                  <div className="toggle-switch">
                    <input
                      id="compact-view"
                      type="checkbox"
                      checked={compactView}
                      onChange={(e) => setCompactView(e.target.checked)}
                    />
                    <label htmlFor="compact-view" className="toggle-label"></label>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>🎮 Controls</h3>
                <div className="setting-item">
                  <label>Keyboard Navigation:</label>
                  <div className="control-info">
                    <p>↑↓ Arrow keys: Navigate Pokemon</p>
                    <p>Enter: View Pokemon details</p>
                    <p>Escape: Close details</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Pokedex; 