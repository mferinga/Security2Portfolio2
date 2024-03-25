# Inkubis

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development purposes.

- Setup the [Inkubis API](https://github.com/Rensvdk20/inkubis-api)
- Get a [TinyMCE](https://www.tiny.cloud/) api key

## Create an environment
- Create a folder called "environments" in the root of the src folder
- Create a file called “environment.ts” in the folder "environments"
- Put the following code into the file and enter your TinyMCE api key in the field 'API_KEY_HERE'
```typescript
export const environment = {
    production: false,
    tiny_api_key: 'API_KEY_HERE'
}
```

## Installation

```bash
$ npm i
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
