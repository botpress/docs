## Release Process

1.  Update the version in `package.json` (optional)
2.  Type `yarn version-docs` (it will update versioned docs from changes made in the `docs/` folder)
3.  Commit all generated files

## Development

Any content pushed to the `dev` branch will be pushed to a special S3 bucket which can be accessed here: http://botpress-devdocs.s3-website-us-east-1.amazonaws.com/versions/
It behaves exactly the same way as master, so you can open your PRs on dev first, then merge then on master when everything works fine. The branch `dev` can be deleted and re-created when necessary, so you can always start fresh from master.

## How it works

When a branch is merged on master, changes made in the `docs/` folder will be listed under the ["Pre-release"](https://botpress.com/docs/next/installation) version of the documentation. Files are pushed automatically to S3.

After the next release, those changes will be visible under the latest version on the documentation page.
