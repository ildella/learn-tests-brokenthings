const createTimeChunks = async (options) => {
  const increment = options.increment || {days: 1}
  const begin = DateTime.fromISO(options.begin)
  const end = DateTime.fromISO(options.end)
  const timeChunks = []
  let chunkBegin = begin
  while (chunkBegin < end) {
    const timeChunk = {
      begin: chunkBegin,
      end: chunkBegin.plus(increment)
    }
    timeChunks.push(timeChunk)
    chunkBegin = timeChunk.end
  }
  return timeChunks
}
