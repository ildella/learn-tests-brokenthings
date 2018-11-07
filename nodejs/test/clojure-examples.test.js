const justiceLeague = [
  {name: 'Superman',
    secretId: 'Clark Kent',
    strength: 100,
    move: ['flight', 'run']},
  {name: 'Batman',
    secretId: 'Bruce Wayne',
    strength: 20,
    move: ['glide', 'drive', 'pilot'],
    vehicles: ['Bat-Mobile', 'Bat-Plane']},
  {name: 'Wonder Woman',
    secretId: 'Diana Prince',
    strength: 90,
    move: ['run'],
    vehicles: ['Invisible-Plane']},
  {name: 'Flash',
    secretId: 'Barry Allen',
    strength: 10,
    move: ['run'],},
  {name: 'Green Lantern',
    secretId: 'Hal Jordan',
    strength: 20,
    move: ['flight']},
  {name: 'Aquaman',
    secretId: 'Arthur Curry',
    strength: 40,
    move: ['swim']}
]

test('get the names of the team members', () => {
  justiceLeague.map(hero => hero.name)
})

test('filter out heroes who are not strong enough', () => {
  justiceLeague.filter(hero => hero.strength < 30).map(hero => hero.name)
})

test('get all vehicles available to the Justice League', () => {
  justiceLeague.map(hero => hero.vehicles).filter(vehicles => vehicles).flat()
})
