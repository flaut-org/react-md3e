import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const pull = event.pull_request;

if (!pull) {
  process.stdout.write('Baseline approval applies to pull requests.\n');
  process.exit(0);
}

const repository = process.env.GITHUB_REPOSITORY;
const endpoint = `${process.env.GITHUB_API_URL}/repos/${repository}`;

async function github(resource) {
  const response = await fetch(`${endpoint}/${resource}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
  });

  assert.ok(response.ok, `GitHub API ${response.status} reading ${resource}`);

  return response.json();
}

async function pages(resource) {
  const collected = [];

  for (let page = 1; ; page += 1) {
    const rows = await github(`${resource}?per_page=100&page=${page}`);

    collected.push(...rows);

    if (rows.length < 100) {
      return collected;
    }
  }
}

const files = await pages(`pulls/${pull.number}/files`);
const baselineChange = (file) => /\/tests\/baselines\/.*\.png$/.test(file);
const changed = files.filter((file) => baselineChange(file.filename) || baselineChange(file.previous_filename ?? ''));

if (changed.length === 0) {
  process.stdout.write('No baseline changes require approval.\n');
  process.exit(0);
}

const reviews = await pages(`pulls/${pull.number}/reviews`);
const latest = new Map();

for (const review of reviews) {
  if (['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)) {
    latest.set(review.user.login, review);
  }
}

const approval = [...latest.values()].find(
  (review) =>
    review.state === 'APPROVED' &&
    review.commit_id === pull.head.sha &&
    review.user.login !== pull.user.login &&
    review.user.type === 'User' &&
    ['OWNER', 'MEMBER', 'COLLABORATOR'].includes(review.author_association),
);

if (approval) {
  process.stdout.write(
    `Independent baseline approval: ${approval.user.login}; ${changed.length} images at ${pull.head.sha}.\n`,
  );
  process.exit(0);
}

const authorReview = reviews.findLast((review) => review.user.login === pull.user.login && review.state !== 'PENDING');
const authorConfirmed =
  authorReview?.state === 'COMMENTED' &&
  authorReview.commit_id === pull.head.sha &&
  authorReview.user.type === 'User' &&
  authorReview.body?.trim() === '/approve-ui-baselines';

if (authorConfirmed) {
  const access = await github(`collaborators/${encodeURIComponent(pull.user.login)}/permission`);

  if (['admin', 'write'].includes(access.permission)) {
    process.stdout.write(
      `Maintainer baseline confirmation by PR author: ${pull.user.login}; ${changed.length} images at ${pull.head.sha}.\n`,
    );
    process.exit(0);
  }
}

assert.fail(
  `${changed.length} changed baseline images need human signoff for current head ${pull.head.sha}. Obtain an independent collaborator's Approve, or inspect the images/diffs and submit a Comment review containing only /approve-ui-baselines as the PR author with write access. Agents must not submit baseline signoff.`,
);
