# Contacts
Manage your contacts list with this serverless app

## Architecture
- This is the [Architecture](https://drive.google.com/file/d/18_4vpUoF5IPFx1oDanFdyijWrWXnskPQ/view?usp=sharing)
- This is a monorepo application. The frontend is power by Angular and the backend with serverless framework

### Features
- CRUD Contact by user
- Upload photo to any Contact and display it to the user
- Only authenticated user can use the application
- Less permissions by lambda
- AWS X-Ray distributed tracing
- API gateway request schemas validation
- Persistence: DynamoDB
- The backend use ports and adapter architecture.

### Git strategy
- This project use [Trunk based development](https://trunkbaseddevelopment.com/5-min-overview/)
- Comments template
    ```
    <type>(scope): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    ```
    * Type
        * feat: A new feature
        * fix: A bug fix
        * docs: Documentation only changes
        * style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons
        * refactor: A code change that neither fixes a bug nor adds a feature
        * perf: A code change that improves performance
        * test: Adding missing or correcting existing tests
        * chore: Changes to the build process or auxiliary tools and libraries such as documentation generation
        * build: Changes to refer to deploy the application
        * ci: A code change that affects the CI/CD
        * revert: Reverts a previous commit
    * scope: Bounded context
    * subject: Short description
    * body: Optional messages with more detail information