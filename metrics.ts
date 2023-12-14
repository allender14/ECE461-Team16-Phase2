import * as fs from 'fs'

//Metric 1
export async function calculate_bus_factor(contributor_commits: number[]) {
  console.log('contributor_commits: ' + contributor_commits)
  var key_contributor = 0
  var total_contributors = contributor_commits.length
  //find midrange of commits
  var max = 0
  var min = 0
  for (var i = 0; i < contributor_commits.length; i++) {
    if (contributor_commits[i] > max) {
      max = contributor_commits[i]
    }
    if (contributor_commits[i] < min) {
      min = contributor_commits[i]
    }
  }
  const midrange = (max + min) / 2
  //find key contributor
  for (var i = 0; i < contributor_commits.length; i++) {
    if (contributor_commits[i] >= midrange) {
      key_contributor++
    }
  }

  console.log('key_contributor: ' + key_contributor)
  console.log('total_contributors: ' + total_contributors)

  if (key_contributor / total_contributors >= 1) {
    return 1
  } else {
    return key_contributor / total_contributors
  }
}
//Metric 2
export async function calculate_correctness(
  lines_of_code: number,
  num_issues: number,
) {
  var correctness_percentage = lines_of_code / (num_issues * 100)
  if (correctness_percentage >= 1) {
    return 1
  } else {
    return correctness_percentage
  }
}
//Metric 3
export async function calculate_ramp_up_time(lines_of_readme: number) {
  if (lines_of_readme > 200) {
    return 1
  } else {
    return lines_of_readme / 200
  }
}
//Metric 4 calculates the license score and how freely we can use the code
export async function calculate_license(license_type: string) {
  if (license_type == null) {
    license_type = 'unlicense'
  } else {
    license_type = license_type.toLowerCase()
  }
  switch (license_type) {
    case 'afl-3.0':
      return 0.8 //open-source, requires attribution and inclusion of license
    case 'apache-2.0':
      return 0.7 //open-source, requires attribution and preservation and disclaimer
    case 'artistic-2.0':
      return 0.8 //open-source, requires attribution and preservation
    case 'bsl-1.0':
      return 0.8 //open-source, requires attribution and preservation
    case 'bsd-2-clause':
      return 0.8 //open-source, requires attribution and preservation
    case 'bsd-3-clause':
      return 0.7 //open-source, requires attribution and preservation and disclaimer
    case 'bsd-3-clause-clear':
      return 0.7 //open-source, requires attribution and preservation and disclaimer
    case 'bsd-4-clause':
      return 0.6 //open-source, requires attribution, preservation, disclaimer and notification
    case '0bsd':
      return 1 // No restrictions
    case 'cc0-1.0':
      return 1 // No restrictions
    case 'cc-by-4.0':
      return 0.9 //open-source, requires attribution
    case 'cc-by-sa-4.0':
      return 0.8 //open-source, requires attribution and preservation
    case 'wtfpl':
      return 1 // Minimal restrictions
    case 'ecl-2.0':
      return 0.8 //open-source, requires attribution and preservation
    case 'epl-1.0':
      return 0.8 //open-source, requires disclaimer and preservation
    case 'epl-2.0':
      return 0.8 //same as epl-1.0
    case 'eupl-1.1':
      return 0.8 //open-source, requires attribution and preservation
    case 'agpl-3.0':
      return 0.9 //Requires that modified versions are made available to users of the software over a network.
    case 'gpl-2.0':
      return 0.9 //Requires preservation of licesnse for derivative works
    case 'gpl-3.0':
      return 0.9 //same as gpl-2.0
    case 'lgpl-2.1':
      return 1 // Low restrictions
    case 'lgpl-3.0':
      return 1 // same as lgpl-2.1
    case 'isc':
      return 1 // Minimal restrictions
    case 'lppl-1.3c':
      return 0.9 //open-source, requires attribution
    case 'ms-pl':
      return 0.9 //open-source, requires attribution
    case 'mit license':
      return 1 // Minimal restrictions
    case 'mpl-2.0':
      return 0.7 // Conditions on source code modifications and copyleft provisions
    case 'osl-3.0':
      return 0.6 //open-source, requires attribution, preservation, disclaimer and copyleft
    case 'postgresql':
      return 0.8 //open-source, requires attribution and disclaimers
    case 'ofl-1.1':
      return 0.8 //open-source, requires attribution and preservation
    case 'ncsa':
      return 0.7 //open-source, requires attribution, preservation and disclaimers
    case 'unlicense':
      return 1
    case 'zlib':
      return 0.8 //open-source, requires attribution and disclaimers
    default:
      return 0
  }
}
//Metric 5 calculates responsiveness based on time since last commit
export async function calculate_responsiveness(days_since_last_commit: number) {
  if (days_since_last_commit <= 7) {
    //within a week
    return 1
  } else if (days_since_last_commit <= 14) {
    //within 2 weeks
    return 0.8
  } else if (days_since_last_commit <= 30) {
    //within a month
    return 0.6
  } else if (days_since_last_commit <= 60) {
    //within 2 months
    return 0.4
  } else if (days_since_last_commit <= 180) {
    //within 6 months
    return 0.2
  } else {
    // more than 6 months
    return 0
  }
}

export async function calculate_dependence(
  pinned_dependencies: number,
  total_dependencies: number,
) {
  if (total_dependencies == 0) {
    return 1
  }

  return pinned_dependencies / total_dependencies
}

//Net_Score
export async function calculate_net_score(
  contributor_commits: number[],
  lines_of_code: number,
  num_issues: number,
  lines_of_readme: number,
  license_type: string,
  days_since_last_commit: number,
  npmPackageUrl: string,
  pinned_dependencies: number,
  total_dependencies: number,
  reviewed_percentage: number,
) {
  const bus_factor = await calculate_bus_factor(contributor_commits)
  const correctness = await calculate_correctness(lines_of_code, num_issues)
  const ramp_up_time = await calculate_ramp_up_time(lines_of_readme)
  const license = await calculate_license(license_type)
  const responsiveness = await calculate_responsiveness(days_since_last_commit)
  const dependence = await calculate_dependence(
    pinned_dependencies,
    total_dependencies,
  )

  const net_score =
    0.05 * bus_factor +
    0.15 * correctness +
    0.15 * ramp_up_time +
    0.1 * license +
    0.3 * responsiveness +
    0.1 * dependence +
    0.15 * reviewed_percentage

  //return each const metric score and net score
  // const  NET_SCORE: number = (Math.floor(net_score / 5 * 10000) / 10000);
  // const  RAMP_UP_SCORE: number = Math.floor(ramp_up_time * 10000) / 10000;
  // const  CORRECTNESS_SCORE: number =  Math.floor(correctness * 10000) / 10000;
  // const  BUS_FACTOR_SCORE: number = Math.floor(bus_factor * 10000) / 10000;
  // const  RESPONSIVE_MAINTAINER_SCORE: number = Math.floor(responsiveness * 10000) / 10000;
  // const  LICENSE_SCORE: number = Math.floor(license * 10000) / 10000;
  // const  DEPENDENCE_SCORE: number = Math.floor(dependence * 10000) / 10000;
  // const  REVIEWED_CODE_SCORE: number = Math.floor(reviewed_code * 10000) / 10000;      DONT UNDERSTAND PURPOSE OF THIS CODE
  // const output = [{
  //     URL: npmPackageUrl,
  //     NET_SCORE: Math.floor(net_score / 5 * 10000) / 10000,
  //     RAMP_UP_SCORE: Math.floor(ramp_up_time * 10000) / 10000,
  //     CORRECTNESS_SCORE: Math.floor(correctness * 10000) / 10000,
  //     BUS_FACTOR_SCORE: Math.floor(bus_factor * 10000) / 10000,
  //     RESPONSIVE_MAINTAINER_SCORE: Math.floor(responsiveness * 10000) / 10000,
  //     LICENSE_SCORE: Math.floor(license * 10000) / 10000,
  //     DEPENDENCE_SCORE: Math.floor(dependence * 10000) / 10000,
  //     REVIEWED_CODE_SCORE: Math.floor(dependence * 10000) / 1000
  // }
  // ]
  console.log(
    JSON.stringify({
      URL: npmPackageUrl,
      NET_SCORE: Math.floor(net_score * 10000) / 10000,
      RAMP_UP_SCORE: Math.floor(ramp_up_time * 10000) / 10000,
      CORRECTNESS_SCORE: Math.floor(correctness * 10000) / 10000,
      BUS_FACTOR_SCORE: Math.floor(bus_factor * 10000) / 10000,
      RESPONSIVE_MAINTAINER_SCORE: Math.floor(responsiveness * 10000) / 10000,
      LICENSE_SCORE: Math.floor(license * 10000) / 10000,
      DEPENDENCE_SCORE: Math.floor(dependence * 10000) / 10000,
      REVIEWED_CODE_SCORE: Math.floor(reviewed_percentage * 10000) / 10000,
    }),
  )
  //console.log(`${printign}`);
  //process.stdout.write(printign);
  return 1
  /*const ndjsonEntry = {
        URL: npmPackageUrl,
        NetScore: Math.floor(net_score * 10) / 10,
        RampUp: Math.floor(ramp_up_time * 10) / 10,
        Correctness:  Math.floor(correctness * 10) / 10,
        BusFactor: Math.floor(bus_factor * 10),
        ResponsiveMaintainer: Math.floor(responsiveness * 10) / 10,
        License: Math.floor(license * 10) / 10,
    };
    const ndjsonOutput = JSON.stringify(ndjsonEntry);
    return ndjsonOutput; */
}
