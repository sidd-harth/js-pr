const { Octokit } = require('@octokit/rest');
const Giphy = require('giphy-api');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    
    const githubToken = core.getInput('github-token');
    const giphyApiKey = core.getInput('giphy-api-key');

    const octokit = new Octokit({ auth: githubToken });
    const giphy = Giphy(giphyApiKey);

    const context = github.context;
    const { owner, repo, number } = context.issue;
    const prComment = await giphy.random('animals');

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: number,
      body: `![Giphy]( ${prComment.data.images.downsized.url} )`
    });

    //const commentUrl = prComment.data.images.downsized.url;
    core.setOutput('comment-url', `${prComment.data.images.downsized.url}`);
    console.log(`Giphy GIF comment added successfully! Comment URL: ${prComment.data.images.downsized.url}`);

    await octokit.issues.requestReviewers({
      owner,
      repo,
      issue_number: number,
      reviewers: ["msrevathi"]
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();