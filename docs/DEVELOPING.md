# Developing

## Notes

### material-ui

The [material-ui](https://github.com/callemall/material-ui) library is being rewritten for its next
major version. The stable branch
[no longer receives new features](https://github.com/callemall/material-ui/blob/master/ROADMAP.md),
and with the rewrite already proving quite useful, this template has switched over to the rewritten
version (`@next`).

For documentation, please refer to the docs on `@next` components,
[available here](https://material-ui-1dab0.firebaseapp.com)

The rewrite is being worked on in the
[next branch](https://github.com/callemall/material-ui/tree/next), available under the `@next` npm
tag.

## How do I:

### Add a new view/route:

TODO: use a tool such as https://plopjs.com/

* Duplicate an existing module e.g. `Home.jsx`
  `cp src/modules/Home.jsx src/modules/MyModule.jsx`

* In `MyModule.jsx`: Rename `Home` variable to `MyModule`

* Configure a new route in `utils/routes.jsx`:

  ```
  ...
  import MyModule from '../modules/MyModule';

  ...

  const routeConfigs = [{
    ...
  }, {
    path: '/mymodule',
    name: 'MyModule',
    component: MyModule,
    icon: 'my_module_icon',
    requiresLogin: false,
  }
  ```

* Add a translation for the module name `MyModule` into all translation files:

  ```
  $ $EDITOR translations/*.js
  ```

  ```
  export default {
    // Navigation
    ...
    MyModule: 'My Awesome Module',

    ...
  }
  ```

* Now your view should be selectable in the `NavigationDrawer`, and also
  accessible as `/mymodule`

### Connect a module to the redux store:

E.g. `MyModule.jsx`.

This makes it possible for `MyModule` to access the redux state ('read' from
the redux store), as well as dispatch actions ('write' to the redux store).

* Replace `export default MyModule;` with:

  ```
  export default connect(
    state => ({
      // mapStateToProps
    }),
    dispatch => ({
      // mapDispatchToProps
    }),
  )(MyModule);
  ```

#### "Read" from the redux store

* Now think about what you want read access to in the redux store. To view the
  entire store state for debugging purposes, use `redux-devtools` (see end of
  [SETUP.md](/docs/SETUP.md)). Say we want to access the NavigationDrawer state,
  whether it's opened or not.

* Replace:

  ```
  state => ({
    // mapStateToProps
  }),
  ```

  with:

  ```
  state => ({
    open: state.drawer.drawerOpened,
  }),
  ```

Now your module can access the drawerOpened state via `this.props.open`.

#### "Write" to the redux store

Changing state in redux is only possible with "actions". Let's say we want to
toggle the navigation drawer open state. There are readily made actions for
this in `src/modules/NavigationDrawer.jsx`. The action we want is exported as
`toggleDrawer`.

* The following part of the connect() call makes it possible to dispatch actions
  from our module by calling `this.props.[action-name]()`.

  ```
    dispatch => ({
      // mapDispatchToProps
    }),
  ```

* Let's replace it with the following to create a `toggle` function which
  dispatches the `toggleDrawer` action:

  ```
    dispatch => ({
      toggle: () => {
        dispatch(toggleDrawer());
      }
    }),
  ```

* Don't forget to import the toggleDrawer action creator at the top of `MyModule.jsx`!
  ```
  import { toggleDrawer } from './NavigationDrawer';
  ```

* Now your module can toggle the NavigationDrawer by calling `this.props.toggle()`.

### Call a REST API:

Thanks to `redux-api`, all you need to do is:

* Configure your endpoints in `src/utils/rest.js` (see more examples in comments):
  ```
  const rest = reduxApi({
    ...

    myEndpoint: {
      url: `${config.apiRoot}/users`,
      crud: true,
    },
  })
  ```

* Now you can read data from and dispatch REST API calls by adding to
  connect(), in e.g. `MyModule.jsx`:

  ```
  export default connect(
    state => ({
      ...
      users: state.myEndpoint,
    }),
    dispatch => ({
      ...
      refresh: () => {
        dispatch(rest.actions.myEndpoint());
      },
    }),
  )(MyModule);
  ```

* Remember to import the REST API action creators in `MyModule.jsx`:

  ```
  import rest from '../utils/rest';
  ```
