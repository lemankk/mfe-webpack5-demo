import React from "react";
import { Box } from "@mfe/shared-components";
import { Route, Redirect, Switch, Link } from "react-router-dom";

const Overview = () => {
  return <Box>
      <h2>Account Balance Overview</h2>
      <Link to="/accounts/balance/account-detail?accountId=123">Detail</Link><br />
      <Link to="/">Go back home</Link><br />
  </Box>;
};

const Detail = () => {
  return <Box>
      <h2>Account Balance Detail</h2>
      <Link to="/accounts/balance/overview">Go back overview</Link><br />
  </Box>;
};
export default function RootContainer({ name = "John" }) {

  return (
    <>
      <Box>@mfe-subapp/account-balance</Box>
      <Switch>
        <Redirect path={"/accounts/balance"} exact to={"/accounts/balance/overview"} />
        <Route path={"/accounts/balance/overview"} exact component={Overview} />
        <Route path={"/accounts/balance/account-detail"} exact component={Detail} />
      </Switch>
    </>
  );
}
