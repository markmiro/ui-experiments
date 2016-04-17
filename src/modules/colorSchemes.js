let colorSchemes = [
  {
    name: 'Zetta',
    colors: ['#2581E2', '#32D2BE', '#F5DE69', '#CE126E', '#F7F7F7', '#E3E3E3', '#606060']
  },
  {
    name: 'Microsoft',
    colors: ['#7CBB00', '#00A1F1', '#FFBB00', '#F65314']
  },
  {
    name: 'NBC',
    colors: ['#E1AC26', '#DC380F', '#9F0812', '#6347B2', '#368DD5', '#70AF1E', '#7E887A']
  },
  {
    name: 'Dribbble',
    colors: ['#444444', '#EA4C89', '#8ABA56', '#FF8833', '#00B6E3', '#9BA5A8']
  },
  {
    name: 'iOS',
    colors: [
      '#5FC9F8', '#FECB2E', '#FD9426', '#FC3158', '#147EFB', '#53D769', '#FC3D39', '#8E8E93'
    ]
  },
  {
    name: 'McDonald\'s',
    colors: [
      '#BF0C0C', '#E76A05', '#FFC600', '#47BC00', '#05007B', '#9748A8', '#2BB3F3', '#865200'
    ]
  },
  {
    name: 'MapBox',
    colors: [
      '#3BB2D0', '#3887BE', '#8A8ACB', '#56B881', '#50667F', '#41AFA5', '#F9886C', '#E55E5E', '#ED6498', '#FBB03B', '#28353D', '#142736'
    ]
  },
  {
    name: 'Hyatt',
    colors: [
      '#6D6E71', '#BF5B20', '#006E96', '#8C8700', '#AD5F7D', '#D79100'
    ]
  }
];

colorSchemes = colorSchemes.map((scheme, i) => {
  const newScheme = scheme;
  newScheme.id = i;
  const wrappedSchemeColors = scheme.colors.map(
    (c, i) => ({id: i, hex: c})
  );
  newScheme.colors = [
    {
      id: 'white',
      hex: '#ffffff'
    },
    {
      id: 'black',
      hex: '#000000'
    },
    ...wrappedSchemeColors,
  ];
  return newScheme;
});

console.log(colorSchemes);

export default colorSchemes;
