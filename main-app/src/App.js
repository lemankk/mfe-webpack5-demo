import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import routes from "./routes";
import { createRemoteComponent } from "./utils";

import { Box } from "@mfe/shared-components";

const useRoutes = () => {
  const [routes, setRoutes] = React.useState([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    fetch("/routes.json")
      .then((res) => res.json())
      .then((_routes) => {
        setRoutes(_routes);
        setReady(true);
      });
  }, []);

  return {
    ready,
    routes,
  };
};

const Navigator = React.memo(({ routes = [] }) => {
  return (
    <Switch>
      <React.Suspense fallback={() => <div />}>
        {routes.map((routeInfo, index) => {
          const { path, exact = false, external } = routeInfo;
          const RemoteComponent = createRemoteComponent(
            external.name,
            external.entry
          );
          return (
            <Route
              key={`$route-${index}`}
              path={path}
              exact={exact}
              component={RemoteComponent}
            />
          );
        })}
      </React.Suspense>
    </Switch>
  );
});

function App() {
  const { routes, ready } = useRoutes();

  return (
    <div>
      <Router>
        <header>
          <Link to="/">Home</Link> |
          <Link to="/accounts/balance">Account Balance</Link>
        </header>
        {ready && <Navigator routes={routes} />}
      </Router>
    </div>
  );
}

export default React.memo(App);
