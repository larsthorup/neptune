# neptune
Sample single-repo setup for a multi-service system with automated deployment

Projects are defined in dependency order in `package.json` in `config.projects`.

`projects` | Description
---|---
config | Shared cross-project configuration
schema | Database schema
api | API service
deploy | Scripts to deploy to production



`npm run ...`   | Description
---             | ---
test            | Run `npm test` in all sub projects
start           | Run local API
deploy          | Migrate production database deploy production API

