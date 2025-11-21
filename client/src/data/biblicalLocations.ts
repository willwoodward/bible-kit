export interface BiblicalLocation {
  name: string;
  lat: number;
  lng: number;
  era: string;
  description: string;
  references: string[];
}

export const biblicalLocations: BiblicalLocation[] = [
  {
    name: 'Jerusalem',
    lat: 31.7683,
    lng: 35.2137,
    era: 'Ancient Israel',
    description: 'Holy city, site of the Temple',
    references: ['2 Samuel 5', 'Psalms 137', 'Matthew 21'],
  },
  {
    name: 'Bethlehem',
    lat: 31.7054,
    lng: 35.2024,
    era: 'Ancient Israel',
    description: 'Birthplace of Jesus',
    references: ['Micah 5:2', 'Matthew 2:1', 'Luke 2:4'],
  },
  {
    name: 'Nazareth',
    lat: 32.7008,
    lng: 35.3034,
    era: 'Roman Palestine',
    description: 'Hometown of Jesus',
    references: ['Matthew 2:23', 'Luke 2:39', 'John 1:46'],
  },
  {
    name: 'Capernaum',
    lat: 32.8806,
    lng: 35.5731,
    era: 'Roman Palestine',
    description: 'Center of Jesus ministry',
    references: ['Matthew 4:13', 'Mark 2:1', 'Luke 7:1'],
  },
  {
    name: 'Jericho',
    lat: 31.8703,
    lng: 35.4444,
    era: 'Ancient Israel',
    description: 'Ancient city conquered by Joshua',
    references: ['Joshua 6', 'Luke 19:1', 'Hebrews 11:30'],
  },
  {
    name: 'Mount Sinai',
    lat: 28.5391,
    lng: 33.9750,
    era: 'Exodus',
    description: 'Where Moses received the Ten Commandments',
    references: ['Exodus 19', 'Exodus 24', 'Galatians 4:25'],
  },
  {
    name: 'Babylon',
    lat: 32.5355,
    lng: 44.4275,
    era: 'Exile Period',
    description: 'Site of Israelite exile',
    references: ['2 Kings 25', 'Daniel 1', 'Revelation 18'],
  },
  {
    name: 'Damascus',
    lat: 33.5138,
    lng: 36.2765,
    era: 'Ancient Near East',
    description: 'Ancient city, site of Paul conversion',
    references: ['Genesis 15:2', 'Acts 9:3', '2 Corinthians 11:32'],
  },
  {
    name: 'Nineveh',
    lat: 36.3489,
    lng: 43.1522,
    era: 'Assyrian Empire',
    description: 'Capital of Assyria, where Jonah preached',
    references: ['Jonah 1:2', 'Jonah 3:3', 'Nahum 1:1'],
  },
  {
    name: 'Ephesus',
    lat: 37.9495,
    lng: 27.3648,
    era: 'Early Church',
    description: 'Major early Christian center',
    references: ['Acts 19', 'Ephesians 1:1', 'Revelation 2:1'],
  },
];
