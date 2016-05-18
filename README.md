# neptune
Sample single-repo setup for a multi-service system with automated deployment

Projects are defined in dependency order in `package.json` in `config.projects`.

`projects` | Description
---|---
config | Shared cross-project configuration
schema | Database schema
deploy | Scripts to deploy to production



`npm run ...` | Description
---|---
test | Run `npm test` in all sub projects



## Techniques used

Local dependencies (like the dependency on `config` in `schema` are referenced twice:
* as a relative dependency to satisfy the `require('config')` expression in the code
* as a preinstall step, to copy any changes from the dependency