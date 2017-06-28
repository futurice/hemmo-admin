# Architecture

## Directory structure

```
assets
├── 200.html -> index.html  # surge.sh 200 page for single page apps
├── favicon.icon            # Favicon
├── icon.png                # Hi-res icon
├── manifest.json           # Web app manifest file
└── ...                     # + various image assets used as placeholders

config
├── development.js          # App config in development environments
└── production.js           # App config in production environments

dist
└── ...                     # Contains built app ready for distribution

src
├── components              # "Dumb/Presentation" components (more below)
│   └── ...
├── modules                 # "Smart/Container" components (more below)
│   └── ...
├── utils
│   ├── intl.js             # i18n (react-intl) config
│   ├── persist.js          # Utils for persisting application state to storage
│   ├── reducer.js          # Root reducer config
│   ├── rest.js             # REST API endpoints' config
│   ├── routes.jsx          # Clientside routing config
│   ├── store.js            # Redux store config
│   └── theme.js            # Theme config
└── index.jsx               # Entry point of app

translations                # Translation files for i18n
├── en.js
└── fi.js

webpack
├── hotReload.jsx           # HMR config
├── template.html           # HTML template file
└── webpack.config.*        # Webpack 2 config files for dev/production
```

## Components (src/components)

The `components` directory should contain React JSX components, which take
their inputs in as `props`. In Flux/Redux parlance the components should be
dumb/presentation components, meaning that components should not be
`connect()`ed to the redux store directly, but instead used by smart/container
components.

The components may be stateful if it makes sense, but do consider externalising
state to the Redux store instead. If the state needs to be persisted, shared by
other components, or inspected by a developer in order to understand the
program state, it should go in the Redux store.

A component may be either written as ES6 `class Foo extends React.Component` or
as a plain JavaScript function component.

## Modules (src/modules)

The `modules` directory contains most of the interesting bits of the
application. As a rule of thumb, this is where all code that modifies the
application state or reads it from the store should go.

Each module is its own directory and represents a "discrete domain" within the
application. There is no hard and fast rule on how to split your application
into modules (in fact, this is one of the most difficult decisions in designing
a Redux application), but here are some qualities of a good module:

 * Represents a screen in the application, or a collection of screens that form a feature.
 * Represents some technical feature that needs its own state (e.g. `navigation`).
 * Rarely needs to use data from other modules' states.
 * Doesn't contain data that is often needed by other modules.
