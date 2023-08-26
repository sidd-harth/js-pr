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
    const prComment = await giphy.random('thank you');
  //  const prMessage = 

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: number,
      body: `### PR - ${pull_request_number} has been assigned. \n ![Giphy](${prComment.data.images.downsized.url}) \n ### 🎉 Thank you for this contribution!`
    });

    //const commentUrl = prComment.data.images.downsized.url;
    core.setOutput('comment-url', `${prComment.data.images.downsized.url}`);
    console.log(`Giphy GIF comment added successfully! Comment URL: ${prComment.data.images.downsized.url}`);

    await octokit.issues.addAssignees({
      owner,
      repo,
      issue_number: number,
      assignees: ["msrevathi"]
    });

    // await octokit.issues.addAssignees({
    //   owner,
    //   repo,
    //   issue_number: number,
    //   labels: ["bug","enhancement"].name
    // });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();