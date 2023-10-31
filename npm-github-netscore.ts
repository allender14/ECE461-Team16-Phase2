const util = require('util')
const exec = util.promisify(require('child_process').exec)
import * as fs from 'fs'
import * as path from 'path'
import * as configDotenv from 'dotenv'
import {calculate_net_score} from './metrics'
import {infoLogger, debugLogger} from './logger'
import {log} from 'console'
import axios from 'axios'

configDotenv.config()

const perPage = 100 // Number of contributors per page, GitHub API maximum is 100
const perPage1 = 1 // We only need the latest commit

function logBasedOnVerbosity(message: string, verbosity: number) {
  const logLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : 0

  if (verbosity == logLevel) {
    if (verbosity == 2) {
      debugLogger.debug(message)
    } else {
      infoLogger.info(message)
    }
  }
}

async function readLines(filePath: string): Promise<string[]> {
  const fileContents = fs.readFileSync(filePath, 'utf-8')
  const decodedURLs: string[] = []

  const lines = fileContents.split('\n')
  for (const line of lines) {
    decodedURLs.push(line.trim())
  }

  return decodedURLs
}

async function countLinesInFile(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        const lines = data.split('\n')
        const numberOfLines = lines.length - 1 // Adjusting for empty line at EOF
        resolve(numberOfLines)
      }
    })
  })
}

// Define your rate limiting constants.
const MAX_REQUESTS_PER_HOUR = 5000 // GitHub GraphQL API limit for most authenticated users
const REQUESTS_PER_MINUTE = 30 // A safe request rate

// A simple rate limiting queue to control the request rate.
const requestQueue: (() => void)[] = []
let isProcessing = false

async function processQueue() {
  if (requestQueue.length > 0 && !isProcessing) {
    isProcessing = true
    const request = requestQueue.shift()
    if (request) {
      await request()
    }
    isProcessing = false
    processQueue()
  }
}

export async function getCommitsPerContributor(
  getUsername: string,
  repositoryName: string,
  personalAccessToken: string,
) {
  try {
    const apiUrl = 'https://api.github.com/graphql'

    const query = `
    query GetCommits($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        refs(first: 50, refPrefix: "refs/") {
          nodes {
            name
            target {
              ... on Commit {
                history {
                  totalCount
                  nodes {
                    author {
                      user {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `

    const variables = {
      owner: getUsername,
      name: repositoryName,
    }

    // Implement rate limiting: Wait if the request rate exceeds the allowed limit.
    if (requestQueue.length >= REQUESTS_PER_MINUTE) {
      await new Promise<void>((resolve) => requestQueue.push(resolve))
    }

    const response = await axios.post(
      apiUrl,
      {
        query,
        variables,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${personalAccessToken}`,
        },
      },
    )

    if (
      !response.data ||
      !response.data.data ||
      !response.data.data.repository
    ) {
      throw new Error(
        'Error fetching commits per contributor: Invalid response from GraphQL API',
      )
    }

    const refs = response.data.data.repository.refs.nodes
    const commitsPerContributor = {}

    for (const ref of refs) {
      const commits = ref.target?.history?.nodes || []

      for (const commit of commits) {
        const contributor = commit.author?.user?.login

        if (contributor) {
          commitsPerContributor[contributor] =
            (commitsPerContributor[contributor] || 0) + 1
        }
      }
    }

    // Implement rate limiting: Allow the next request to proceed.
    processQueue()

    return commitsPerContributor
  } catch (error) {
    throw error
  }
}

async function getLatestCommit(getUsername: string, repositoryName: string) {
  try {
    const commitsUrl = `https://api.github.com/repos/${getUsername}/${repositoryName}/commits?per_page=${perPage1}`

    const latestCommitResponse = await axios.get(commitsUrl)
    const latestCommit = latestCommitResponse.data[0]

    return latestCommit
  } catch (error) {
    logBasedOnVerbosity(`Error fetching latest commit: ${error}`, 2)
    process.exit(1)
  }
}

async function getTimeSinceLastCommit(
  getUsername: string,
  repositoryName: string,
  axiosConfig: any,
): Promise<number | null> {
  try {
    const latestCommit = await getLatestCommit(getUsername, repositoryName)

    if (!latestCommit) {
      logBasedOnVerbosity('No commits found in the repository', 1)
      return 0 // Return 0 days if there are no commits
    }

    const lastCommitDate = new Date(latestCommit.commit.author?.date)
    const currentDate = new Date()

    const timeSinceLastCommitInMilliseconds =
      currentDate.getTime() - lastCommitDate.getTime()

    // Convert milliseconds to days
    const days = Math.floor(
      timeSinceLastCommitInMilliseconds / (1000 * 60 * 60 * 24),
    )

    return days // Return the number of days
  } catch (error) {
    logBasedOnVerbosity(`Error calculating time since last commit: ${error}`, 2)
    process.exit(1)
  }
}

async function extractGitHubInfo(
  npmPackageUrl: string,
): Promise<{username: string; repository: string} | null> {
  try {
    const githubUrlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/|$)/i

    //Checks if it is a github url if not treats it as a npm url
    if (!githubUrlPattern.test(npmPackageUrl)) {
      // Check if the URL is a valid npm package URL
      const npmUrlPattern = /https:\/\/(www\.)?npmjs\.com\/package\/([^/?#]+)/
      const npmUrlMatch = npmPackageUrl.match(npmUrlPattern)
      console.log('NPM URL Match:' + npmUrlMatch)

      if (!npmUrlMatch || npmUrlMatch.length < 3) {
        logBasedOnVerbosity('Invalid npm package URL', 2)
        process.exit(1)
      }

      // Extract the package name
      const packageName = npmUrlMatch[2]
      console.log('Package Name: ' + packageName)

      // Fetch the package info from npm registry
      const apiUrl = `https://registry.npmjs.org/${packageName}`
      console.log('APIurl: ' + apiUrl)
      const response = await axios.get(apiUrl)
      const repositoryUrl = response.data?.repository?.url
      console.log('RepoURL: ' + repositoryUrl)

      if (!repositoryUrl) {
        throw new Error('No GitHub repository URL found for the package.')
      }

      // Check if the repository URL follows the typical GitHub structure
      const githubUrlMatch = repositoryUrl.match(githubUrlPattern)
      if (githubUrlMatch && githubUrlMatch.length >= 3) {
        const username = githubUrlMatch[1]
        const repository = githubUrlMatch[2]

        return {username, repository}
      } else {
        // If the URL doesn't follow the typical structure, attempt to extract from the URL
        const urlParts = repositoryUrl.split('/')
        if (urlParts.length >= 4) {
          const username = urlParts[urlParts.length - 2]
          const repository = urlParts[urlParts.length - 1].replace('.git', '')
          return {username, repository}
        } else {
          logBasedOnVerbosity(
            'Unable to extract GitHub username and repository name from the repository URL.',
            2,
          )
          console.log(
            'Unable to extract GitHub username and repository name from the repository URL.',
          )
          process.exit(1)
        }
      }
    } else {
      const githubUrlMatch = npmPackageUrl.match(githubUrlPattern)
      console.log('GH url match: ' + githubUrlMatch)

      if (githubUrlMatch && githubUrlMatch.length >= 3) {
        const username = githubUrlMatch[1]
        const repository = githubUrlMatch[2]
        return {username, repository}
      } else {
        // If the URL doesn't follow the typical structure, attempt to extract from the URL
        const urlParts = npmPackageUrl.split('/')
        if (urlParts.length >= 4) {
          const username = urlParts[urlParts.length - 2]
          const repository = urlParts[urlParts.length - 1].replace('.git', '')
          return {username, repository}
        } else {
          logBasedOnVerbosity(
            'Unable to extract GitHub username and repository name from the repository URL.',
            2,
          )
          process.exit(1)
        }
      }
    }
  } catch (error) {
    logBasedOnVerbosity(`Error extracting GitHub info: ${error.message}`, 2)
    process.exit(1)
  }
}

async function cloneREPO(username: string, repository: string) {
  try {
    const repoUrl = `https://github.com/${username}/${repository}.git`
    const destinationPath = `cli_storage/${repository}`
    const cloneCommand = `git clone ${repoUrl} ${destinationPath}`

    const {stdout, stderr} = await exec(cloneCommand)
  } catch (error) {
    logBasedOnVerbosity(`Error cloning repository: ${error.message}`, 2)
    process.exit(1)
  }
}

function addLists(list1: number[], list2: number[]): number[] {
  // Check if both lists have the same length
  if (list1.length !== list2.length) {
    throw new Error(
      'Lists must have the same length for element-wise addition.',
    )
  }

  // Use the map function to add elements element-wise
  const resultList: number[] = list1.map((value, index) => value + list2[index])

  return resultList
}

async function traverseDirectory(dir: string) {
  const files = fs.readdirSync(dir) // Get all files and directories in the current directory
  let count: number[] = [0, 0]

  for (const file of files) {
    const filePath = path.join(dir, file) // Get the full path of the file or directory
    const stats = fs.statSync(filePath) // Get file/directory stats

    if (stats.isDirectory()) {
      // If it's a directory, recursively traverse it
      count = addLists(count, await traverseDirectory(filePath))
    } else if (stats.isFile()) {
      // If it's a file, count the lines
      if (!filePath.includes('.txt')) {
        const fileLineCount = countLines(filePath)
        count[1] += fileLineCount
      }
      if (filePath.includes('README.md')) {
        const fileLineCount = countLines(filePath)
        count[0] += fileLineCount
      }
    }
  }
  return count
}

function countLines(filePath: string): number {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const lines = fileContent.split('\n')
    return lines.length
  } catch (error) {
    logBasedOnVerbosity(`Error reading file: ${filePath}`, 2)
    process.exit(1)
  }
}

async function fetchGitHubInfo(
  npmPackageUrl: string,
  personalAccessToken: string,
) {
  try {
    const githubInfo = await extractGitHubInfo(npmPackageUrl)
    if (githubInfo) {
      // Modify the headers to include the personal access token
      const headers = {
        Authorization: `Bearer ${personalAccessToken}`,
      }

      // Use axios with the modified headers
      const axiosConfig = {
        headers,
      }
      console.log('Github Username:' + githubInfo.username)
      console.log('Github Repo:' + githubInfo.repository)
      const url = `https://api.github.com/repos/${githubInfo.username}/${githubInfo.repository}`
      const response = await axios.get(url, axiosConfig)
      //gather info
      await cloneREPO(githubInfo.username, githubInfo.repository)
      const days_since_last_commit: number = (await getTimeSinceLastCommit(
        githubInfo.username,
        githubInfo.repository,
        axiosConfig,
      )) as number
      console.log('days since last commit: ' + days_since_last_commit)
      const issue_count: number = response.data.open_issues_count
      const contributor_commits = await getCommitsPerContributor(
        githubInfo.username,
        githubInfo.repository,
        personalAccessToken,
      )

      if (contributor_commits === null) {
        // Handle the error, e.g., log an error message or take appropriate action
        console.error('Error fetching commits per contributor')
      } else {
        let repolicense: string = 'unlicense'
        if (response.data.license) {
          const license = response.data.license
          if (license.key) {
            repolicense = license.key
          } else {
            logBasedOnVerbosity('No license type found for this repository.', 1)
          }
        } else {
          logBasedOnVerbosity(
            'No license information found for this repository. Continuing as Unlicensed.',
            1,
          )
        }
        const rootDirectory = `./cli_storage/${githubInfo.repository}`
        const totalLines = await traverseDirectory(rootDirectory)
        const total_lines = totalLines[1] - totalLines[0]

        //calculate netscore and all metrics
        const scores = await calculate_net_score(
          contributor_commits,
          total_lines,
          issue_count,
          totalLines[0],
          repolicense,
          days_since_last_commit,
          npmPackageUrl,
        )

        return scores
      }
    }
  } catch (error) {
    logBasedOnVerbosity(`Error: ${error.message}`, 2)
    process.exit(1)
  }
}

export {fetchGitHubInfo, readLines, countLinesInFile}
