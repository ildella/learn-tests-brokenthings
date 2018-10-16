async function getFixturesAndTeamSequential(teamId) {
  const fixtures = await fixtureModel.fetchAll()
  const team = await teamModel.fetch(teamId)
  return {
    team,
    fixtures: fixtures.filter(x => x.teamId === teamId)
  }
}

async function getFixturesAndTeamParallel(teamId) {
  const fixturesPromise = fixtureModel.fetchAll()
  const teamPromise = teamModel.fetch(teamId)

  const fixtures = await fixturesPromise
  const team = await teamPromise

  return {
    team,
    fixtures: fixtures.filter(x => x.teamId === teamId)
  }
}