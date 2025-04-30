export const envOptions = [
  {
    name: 'Forest Area',
    id: 'Forest Area (Plains)',
    subHd: '(Plains)',
    imgPath: require('../../assets/images/forestPlains.png'),
    langConst: 'forestArea',
    langConstSub: 'plains',
  },
  {
    name: 'Forest Area',
    subHd: '(Mountains/Hills)',
    id: 'Forest Area (Mountains/Hills)',
    imgPath: require('../../assets/images/forestHillsMontainous.png'),
    langConst: 'forestArea',
    langConstSub: 'mountainHills',
  },
  {
    name: 'Farm Land',
    subHd: '(Agri/Flower fields)',
    id: 'Farm Land (Agricultural/Flower fields)',
    imgPath: require('../../assets/images/farmLands.png'),
    langConst: 'farmLand',
    langConstSub: 'agriFlowerFields',
  },
  {
    name: 'Tree Plantations',
    subHd: '/Orchards',
    // id: 'Tree Plantation/Orchards (Apple, Jamun, Eucalyptus, Lychee, Coconut, etc.)',
    id:"Tree Plantation/Orchards",
    imgPath: require('../../assets/images/treePlantationOrchards.png'),
    langConst: 'treePlantations',
    langConstSub: 'orchards',
  },

  {
    name: 'Urban Area',
    subHd: '(Garden, Rooftop,..)',
    id: 'Urban Area (Parks/Gardens/Rooftops)',
    imgPath: require('../../assets/images/urbanArea.png'),
    langConst: 'urbanArea',
    langConstSub: 'gardenRooftop',
  },
  {
    name: 'Mangroves',
    subHd: '(..)',
    id: 'Mangroves',
    imgPath: require('../../assets/images/mangroves.png'),
    langConst: 'mangroves',
    langConstSub: '',
  },
];

export const typeOptions = [
  {
    name: 'mellifera',
    imgPath: require('../../assets/images/mellifera.png'),
    desc: 'European Bee',
    langConst: 'mellifera',
    langConstDesc: 'europeanBee',
    value:"mellifera"
  },
  // {
  //   name: 'trigona',
  //   imgPath: require('../../assets/images/Trigona.png'),
  //   desc: 'Stingless Bee',
  //   langConst: 'trigona',
  //   langConstDesc: 'stinglessBee',
  //   value:"trigona"
  // },
  // {
  //   name: 'dorsata',
  //   imgPath: require('../../assets/images/Dorsata.png'),
  //   desc: 'Rock bee',
  //   langConst: 'dorsata',
  //   langConstDesc: 'rockBee',
  //   value:"dorsata"
  // },
  {
    name: 'cerana indica',
    imgPath: require('../../assets/images/CeranaIndica.png'),
    desc: 'Indian Bee',
    langConst: 'ceranaIndica',
    langConstDesc: 'indianBee',
    value:"cerana indica"
  },

];

export const userObj = {
  _id: {
    $oid: '65128cbcadabe1c4c5cde7b4',
  },
  isDeleted: false,
  mobileNumber: '9090909012',
  accessInfo: {},
  loginTime: {
    $date: '2023-09-26T07:48:12.507Z',
  },
  __v: 0,
  name: 'Shravan',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTI4Y2JjYWRhYmUxYzRjNWNkZTdiNCIsIm5hbWUiOiJBbm9vamEiLCJtb2JpbGVOdW1iZXIiOiI5MDkwOTA5MDEyIiwidXNlclR5cGUiOiJ1c2VyIiwiaWF0IjoxNjk1NzE0Njk2fQ.Bn1NxK4CZdl82mDj7Ef9H5_W2RSpI0MAhv3dHDZzkaw',
  businessIdea: 'Beekeeping/Apiculture',
  address: {
    district: 'Araria',
    state: null,
    pincode: '560102',
    location: {},
  },
  gender: 'male',
  operatingEnterpriseSince: 2023,
  preferredLanguage: 'hi',
};

export const transliterationScriptsMap = new Map([
  ['hi', 'Deva'],
  ['ta', 'Taml'],
  ['ml', 'Mlym'],
  ['mr', 'Deva'],
  ['gu', 'Gujr'],
  ['bn', 'Beng'],
  ['tl', 'Telu'],
  ['kn', 'Knda'],
]);
