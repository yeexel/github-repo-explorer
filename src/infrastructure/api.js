const GITHUB_API_BASE_URL = 'https://api.github.com'
const GITHUB_ACCESS_TOKEN = process.env.REACT_APP_GITHUB_ACCESS_TOKEN

const fetchAsync = async (url) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const data = await response.json()

  return data
}

export const getGithubUser = userName => fetchAsync(`${GITHUB_API_BASE_URL}/users/${userName}?access_token=${GITHUB_ACCESS_TOKEN}`)

export const getGithubRepos = (userName, page, perPage) => fetchAsync(`${GITHUB_API_BASE_URL}/users/${userName}/repos?access_token=${GITHUB_ACCESS_TOKEN}&page=${page}&per_page=${perPage}`)
