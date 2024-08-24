export const formatRedisKey = (str) => str.replace(/\s*\.\s*/g, '.').trim()

export const splitArrayIntoChunks = (array, chunkSize) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize)
    chunks.push(chunk)
  }
  return chunks
}
