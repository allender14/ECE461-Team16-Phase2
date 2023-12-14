"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.fetchGitHubInfo = exports.getReviewedPercentage = exports.countLinesInFile = exports.readLines = void 0;
var axios = require('axios');
var util = require('util');
var exec = util.promisify(require('child_process').exec);
var fs = require("fs");
var path = require("path");
var metrics_1 = require("./metrics");
var logger_1 = require("./logger");
var rest_1 = require("@octokit/rest");
var perPage = 100; // Number of contributors per page, GitHub API maximum is 100
var perPage1 = 1; // We only need the latest commit
// Define your rate limiting constants.
var MAX_REQUESTS_PER_HOUR = 5000; // GitHub GraphQL API limit for most authenticated users
var REQUESTS_PER_MINUTE = 30; // A safe request rate
// A simple rate limiting queue to control the request rate.
var requestQueue = [];
var isProcessing = false;
function logBasedOnVerbosity(message, verbosity) {
    var logLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : 0;
    if (verbosity == logLevel) {
        if (verbosity == 2) {
            logger_1.debugLogger.debug(message);
        }
        else {
            logger_1.infoLogger.info(message);
        }
    }
}
function readLines(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContents, decodedURLs, lines, _i, lines_1, line;
        return __generator(this, function (_a) {
            fileContents = fs.readFileSync(filePath, 'utf-8');
            decodedURLs = [];
            lines = fileContents.split('\n');
            for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                line = lines_1[_i];
                decodedURLs.push(line.trim());
            }
            return [2 /*return*/, decodedURLs];
        });
    });
}
exports.readLines = readLines;
function countLinesInFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            var lines = data.split('\n');
                            var numberOfLines = lines.length - 1; // Adjusting for empty line at EOF
                            resolve(numberOfLines);
                        }
                    });
                })];
        });
    });
}
exports.countLinesInFile = countLinesInFile;
function getReviewedPercentage(owner, repo, personalAccessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var octokit, response, reviewedLines_1, totalLines_1, totalPullRequests, reviewedPullRequests, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    octokit = new rest_1.Octokit({ auth: personalAccessToken });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, octokit.pulls.list({
                            owner: owner,
                            repo: repo,
                            state: 'all'
                        })];
                case 2:
                    response = _a.sent();
                    reviewedLines_1 = 0;
                    totalLines_1 = 0;
                    return [4 /*yield*/, Promise.all(response.data.map(function (pullRequest) { return __awaiter(_this, void 0, void 0, function () {
                            var reviewsResponse, isReviewed, filesResponse, _i, _a, file, prResponse;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, octokit.pulls.listReviews({
                                            owner: owner,
                                            repo: repo,
                                            pull_number: pullRequest.number
                                        })];
                                    case 1:
                                        reviewsResponse = _b.sent();
                                        isReviewed = reviewsResponse.data.some(function (review) { return review.state === 'APPROVED'; });
                                        if (!isReviewed) return [3 /*break*/, 3];
                                        return [4 /*yield*/, octokit.pulls.listFiles({
                                                owner: owner,
                                                repo: repo,
                                                pull_number: pullRequest.number
                                            })];
                                    case 2:
                                        filesResponse = _b.sent();
                                        for (_i = 0, _a = filesResponse.data; _i < _a.length; _i++) {
                                            file = _a[_i];
                                            reviewedLines_1 += file.changes;
                                        }
                                        _b.label = 3;
                                    case 3: return [4 /*yield*/, octokit.pulls.get({
                                            owner: owner,
                                            repo: repo,
                                            pull_number: pullRequest.number
                                        })];
                                    case 4:
                                        prResponse = _b.sent();
                                        totalLines_1 += prResponse.data.additions;
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    _a.sent();
                    totalPullRequests = response.data.length;
                    reviewedPullRequests = reviewedLines_1 > 0 ? 1 : 0 // Assuming at least one line is reviewed
                    ;
                    return [2 /*return*/, (reviewedLines_1 / totalLines_1)];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error fetching reviewed lines percentage: ".concat(error_1.message));
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getReviewedPercentage = getReviewedPercentage;
function processQueue() {
    return __awaiter(this, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(requestQueue.length > 0 && !isProcessing)) return [3 /*break*/, 3];
                    isProcessing = true;
                    request = requestQueue.shift();
                    if (!request) return [3 /*break*/, 2];
                    return [4 /*yield*/, request()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    isProcessing = false;
                    processQueue();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getCommitsPerContributor(getUsername, repositoryName, personalAccessToken) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var apiUrl, query, variables, response, refs, commitsPerContributor, _i, refs_1, ref, commits, _e, commits_1, commit, contributor, commitCountsArray, error_2;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 4, , 5]);
                    apiUrl = 'https://api.github.com/graphql';
                    query = "\n    query GetCommits($owner: String!, $name: String!) {\n      repository(owner: $owner, name: $name) {\n        refs(first: 50, refPrefix: \"refs/\") {\n          nodes {\n            name\n            target {\n              ... on Commit {\n                history {\n                  totalCount\n                  nodes {\n                    author {\n                      user {\n                        login\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    ";
                    variables = {
                        owner: getUsername,
                        name: repositoryName
                    };
                    if (!(requestQueue.length >= REQUESTS_PER_MINUTE)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve) { return requestQueue.push(resolve); })];
                case 1:
                    _f.sent();
                    _f.label = 2;
                case 2: return [4 /*yield*/, axios.post(apiUrl, {
                        query: query,
                        variables: variables
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: "Bearer ".concat(personalAccessToken)
                        }
                    })];
                case 3:
                    response = _f.sent();
                    if (!response.data ||
                        !response.data.data ||
                        !response.data.data.repository) {
                        throw new Error('Error fetching commits per contributor: Invalid response from GraphQL API');
                    }
                    refs = response.data.data.repository.refs.nodes;
                    commitsPerContributor = {};
                    for (_i = 0, refs_1 = refs; _i < refs_1.length; _i++) {
                        ref = refs_1[_i];
                        commits = ((_b = (_a = ref.target) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.nodes) || [];
                        for (_e = 0, commits_1 = commits; _e < commits_1.length; _e++) {
                            commit = commits_1[_e];
                            contributor = (_d = (_c = commit.author) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.login;
                            if (contributor) {
                                commitsPerContributor[contributor] =
                                    (commitsPerContributor[contributor] || 0) + 1;
                            }
                        }
                    }
                    commitCountsArray = Object.values(commitsPerContributor);
                    // Implement rate limiting: Allow the next request to proceed.
                    processQueue();
                    return [2 /*return*/, commitCountsArray];
                case 4:
                    error_2 = _f.sent();
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getLatestCommit(getUsername, repositoryName) {
    return __awaiter(this, void 0, void 0, function () {
        var commitsUrl, latestCommitResponse, latestCommit, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    commitsUrl = "https://api.github.com/repos/".concat(getUsername, "/").concat(repositoryName, "/commits?per_page=").concat(perPage1);
                    return [4 /*yield*/, axios.get(commitsUrl)];
                case 1:
                    latestCommitResponse = _a.sent();
                    latestCommit = latestCommitResponse.data[0];
                    return [2 /*return*/, latestCommit];
                case 2:
                    error_3 = _a.sent();
                    logBasedOnVerbosity("Error fetching latest commit: ".concat(error_3), 2);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getTimeSinceLastCommit(getUsername, repositoryName, axiosConfig) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var latestCommit, lastCommitDate, currentDate, timeSinceLastCommitInMilliseconds, days, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getLatestCommit(getUsername, repositoryName)];
                case 1:
                    latestCommit = _b.sent();
                    if (!latestCommit) {
                        logBasedOnVerbosity('No commits found in the repository', 1);
                        return [2 /*return*/, 0]; // Return 0 days if there are no commits
                    }
                    lastCommitDate = new Date((_a = latestCommit.commit.author) === null || _a === void 0 ? void 0 : _a.date);
                    currentDate = new Date();
                    timeSinceLastCommitInMilliseconds = currentDate.getTime() - lastCommitDate.getTime();
                    days = Math.floor(timeSinceLastCommitInMilliseconds / (1000 * 60 * 60 * 24));
                    return [2 /*return*/, days]; // Return the number of days
                case 2:
                    error_4 = _b.sent();
                    logBasedOnVerbosity("Error calculating time since last commit: ".concat(error_4), 2);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getPinnedDependencies(username, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var apiUrl, response, packageJson, dependencies, pinned_dependencies, total_dependencies, _i, _a, _b, dependency, version, major, minor, dot, error_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    apiUrl = "https://api.github.com/repos/".concat(username, "/").concat(repository, "/contents/package.json");
                    return [4 /*yield*/, axios.get(apiUrl, {
                            headers: {
                                Accept: 'application/vnd.github.v3.raw'
                            }
                        })];
                case 1:
                    response = _c.sent();
                    packageJson = response.data;
                    dependencies = packageJson.dependencies || {};
                    pinned_dependencies = 0;
                    total_dependencies = Object.keys(dependencies).length;
                    for (_i = 0, _a = Object.entries(dependencies); _i < _a.length; _i++) {
                        _b = _a[_i], dependency = _b[0], version = _b[1];
                        major = void 0;
                        minor = void 0;
                        dot = version.indexOf('.');
                        if (dot <= 0 || dot > 2) {
                            major = 'x';
                            minor = 'x';
                        }
                        else {
                            major = version[dot - 1];
                            minor = version[dot + 1];
                        }
                        // Check if the version is a valid pinned version
                        if (!isNaN(parseInt(major, 10)) &&
                            !isNaN(parseInt(minor, 10)) &&
                            !version.startsWith('^')) {
                            pinned_dependencies++;
                        }
                    }
                    return [2 /*return*/, { pinned_dependencies: pinned_dependencies, total_dependencies: total_dependencies }];
                case 2:
                    error_5 = _c.sent();
                    console.error("Error counting pinned dependencies: ".concat(error_5.message));
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function extractGitHubInfo(npmPackageUrl) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var githubUrlPattern, npmUrlPattern, npmUrlMatch, packageName, apiUrl, response, repositoryUrl, githubUrlMatch, username, repository, urlParts, username, repository, githubUrlMatch, username, repository, urlParts, username, repository, error_6;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    githubUrlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/|$)/i;
                    if (!!githubUrlPattern.test(npmPackageUrl)) return [3 /*break*/, 2];
                    npmUrlPattern = /https:\/\/(www\.)?npmjs\.com\/package\/([^/?#]+)/;
                    npmUrlMatch = npmPackageUrl.match(npmUrlPattern);
                    console.log('NPM URL Match:' + npmUrlMatch);
                    if (!npmUrlMatch || npmUrlMatch.length < 3) {
                        logBasedOnVerbosity('Invalid npm package URL', 2);
                        process.exit(1);
                    }
                    packageName = npmUrlMatch[2];
                    console.log('Package Name: ' + packageName);
                    apiUrl = "https://registry.npmjs.org/".concat(packageName);
                    console.log('APIurl: ' + apiUrl);
                    return [4 /*yield*/, axios.get(apiUrl)];
                case 1:
                    response = _c.sent();
                    repositoryUrl = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.repository) === null || _b === void 0 ? void 0 : _b.url;
                    console.log('RepoURL: ' + repositoryUrl);
                    if (!repositoryUrl) {
                        throw new Error('No GitHub repository URL found for the package.');
                    }
                    githubUrlMatch = repositoryUrl.match(githubUrlPattern);
                    if (githubUrlMatch && githubUrlMatch.length >= 3) {
                        username = githubUrlMatch[1];
                        repository = githubUrlMatch[2];
                        return [2 /*return*/, { username: username, repository: repository }];
                    }
                    else {
                        urlParts = repositoryUrl.split('/');
                        if (urlParts.length >= 4) {
                            username = urlParts[urlParts.length - 2];
                            repository = urlParts[urlParts.length - 1].replace('.git', '');
                            return [2 /*return*/, { username: username, repository: repository }];
                        }
                        else {
                            logBasedOnVerbosity('Unable to extract GitHub username and repository name from the repository URL.', 2);
                            console.log('Unable to extract GitHub username and repository name from the repository URL.');
                            process.exit(1);
                        }
                    }
                    return [3 /*break*/, 3];
                case 2:
                    githubUrlMatch = npmPackageUrl.match(githubUrlPattern);
                    console.log('GH url match: ' + githubUrlMatch);
                    if (githubUrlMatch && githubUrlMatch.length >= 3) {
                        username = githubUrlMatch[1];
                        repository = githubUrlMatch[2];
                        return [2 /*return*/, { username: username, repository: repository }];
                    }
                    else {
                        urlParts = npmPackageUrl.split('/');
                        if (urlParts.length >= 4) {
                            username = urlParts[urlParts.length - 2];
                            repository = urlParts[urlParts.length - 1].replace('.git', '');
                            return [2 /*return*/, { username: username, repository: repository }];
                        }
                        else {
                            logBasedOnVerbosity('Unable to extract GitHub username and repository name from the repository URL.', 2);
                            process.exit(1);
                        }
                    }
                    _c.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_6 = _c.sent();
                    logBasedOnVerbosity("Error extracting GitHub info: ".concat(error_6.message), 2);
                    process.exit(1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function cloneREPO(username, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var repoUrl, destinationPath, cloneCommand, _a, stdout, stderr, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    repoUrl = "https://github.com/".concat(username, "/").concat(repository, ".git");
                    destinationPath = "cli_storage/".concat(repository);
                    cloneCommand = "git clone ".concat(repoUrl, " ").concat(destinationPath);
                    return [4 /*yield*/, exec(cloneCommand)];
                case 1:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _b.sent();
                    logBasedOnVerbosity("Error cloning repository: ".concat(error_7.message), 2);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function addLists(list1, list2) {
    // Check if both lists have the same length
    if (list1.length !== list2.length) {
        throw new Error('Lists must have the same length for element-wise addition.');
    }
    // Use the map function to add elements element-wise
    var resultList = list1.map(function (value, index) { return value + list2[index]; });
    return resultList;
}
function traverseDirectory(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var files, count, _i, files_1, file, filePath, stats, _a, _b, fileLineCount, fileLineCount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    files = fs.readdirSync(dir) // Get all files and directories in the current directory
                    ;
                    count = [0, 0];
                    _i = 0, files_1 = files;
                    _c.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                    file = files_1[_i];
                    filePath = path.join(dir, file) // Get the full path of the file or directory
                    ;
                    stats = fs.statSync(filePath) // Get file/directory stats
                    ;
                    if (!stats.isDirectory()) return [3 /*break*/, 3];
                    _a = addLists;
                    _b = [count];
                    return [4 /*yield*/, traverseDirectory(filePath)];
                case 2:
                    // If it's a directory, recursively traverse it
                    count = _a.apply(void 0, _b.concat([_c.sent()]));
                    return [3 /*break*/, 4];
                case 3:
                    if (stats.isFile()) {
                        // If it's a file, count the lines
                        if (!filePath.includes('.txt')) {
                            fileLineCount = countLines(filePath);
                            count[1] += fileLineCount;
                        }
                        if (filePath.includes('README.md')) {
                            fileLineCount = countLines(filePath);
                            count[0] += fileLineCount;
                        }
                    }
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, count];
            }
        });
    });
}
function countLines(filePath) {
    try {
        var fileContent = fs.readFileSync(filePath, 'utf-8');
        var lines = fileContent.split('\n');
        return lines.length;
    }
    catch (error) {
        logBasedOnVerbosity("Error reading file: ".concat(filePath), 2);
        process.exit(1);
    }
}
function fetchGitHubInfo(npmPackageUrl, personalAccessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var githubInfo, headers, axiosConfig, url, response, days_since_last_commit, repolicense, issue_count, contributor_commits, license, rootDirectory, totalLines, total_lines, _a, pinned_dependencies, total_dependencies, reviewed_percentage, scores, error_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 11, , 12]);
                    return [4 /*yield*/, extractGitHubInfo(npmPackageUrl)];
                case 1:
                    githubInfo = _b.sent();
                    if (!githubInfo) return [3 /*break*/, 10];
                    headers = {
                        Authorization: "Bearer ".concat(personalAccessToken)
                    };
                    axiosConfig = {
                        headers: headers
                    };
                    console.log('Github Username:' + githubInfo.username);
                    console.log('Github Repo:' + githubInfo.repository);
                    url = "https://api.github.com/repos/".concat(githubInfo.username, "/").concat(githubInfo.repository);
                    return [4 /*yield*/, axios.get(url, axiosConfig)
                        //gather info
                    ];
                case 2:
                    response = _b.sent();
                    //gather info
                    return [4 /*yield*/, cloneREPO(githubInfo.username, githubInfo.repository)];
                case 3:
                    //gather info
                    _b.sent();
                    return [4 /*yield*/, getTimeSinceLastCommit(githubInfo.username, githubInfo.repository, axiosConfig)];
                case 4:
                    days_since_last_commit = (_b.sent());
                    console.log('days since last commit: ' + days_since_last_commit);
                    repolicense = 'unlicense';
                    issue_count = response.data.open_issues_count;
                    return [4 /*yield*/, getCommitsPerContributor(githubInfo.username, githubInfo.repository, personalAccessToken)];
                case 5:
                    contributor_commits = _b.sent();
                    if (contributor_commits === null) {
                        // Handle the error, e.g., log an error message or take appropriate action
                        console.error('Error fetching commits per contributor');
                    }
                    else {
                        if (response.data.license) {
                            license = response.data.license;
                            if (license.key) {
                                repolicense = license.key;
                            }
                            else {
                                logBasedOnVerbosity('No license type found for this repository.', 1);
                            }
                        }
                        else {
                            logBasedOnVerbosity('No license information found for this repository. Continuing as Unlicensed.', 1);
                        }
                    }
                    rootDirectory = "./cli_storage/".concat(githubInfo.repository);
                    return [4 /*yield*/, traverseDirectory(rootDirectory)];
                case 6:
                    totalLines = _b.sent();
                    total_lines = totalLines[1] - totalLines[0];
                    return [4 /*yield*/, getPinnedDependencies(githubInfo.username, githubInfo.repository)];
                case 7:
                    _a = _b.sent(), pinned_dependencies = _a.pinned_dependencies, total_dependencies = _a.total_dependencies;
                    return [4 /*yield*/, getReviewedPercentage(githubInfo.username, githubInfo.repository, personalAccessToken)
                        //calculate netscore and all metrics
                    ];
                case 8:
                    reviewed_percentage = _b.sent();
                    return [4 /*yield*/, (0, metrics_1.calculate_net_score)(contributor_commits, total_lines, issue_count, totalLines[0], repolicense, days_since_last_commit, npmPackageUrl, pinned_dependencies, total_dependencies, reviewed_percentage)];
                case 9:
                    scores = _b.sent();
                    return [2 /*return*/, scores];
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_8 = _b.sent();
                    logBasedOnVerbosity("Error: ".concat(error_8.message), 2);
                    process.exit(1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.fetchGitHubInfo = fetchGitHubInfo;
