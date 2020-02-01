import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../components/NotFound";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Messages from "../pages/Messages";
import User from "../pages/User";
import Login from "../pages/Login";
import Account from "../pages/Account";

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Define our routes and the component they render:
export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />

      <Route path="/login" component={Login} />

      <Route path="/my-account" component={Account} />
      <Route path="/account/:id" component={User} />

      <Route path="/messages" component={Messages} />
      <Route path="/chat/:id" component={Messages} />

      <Route path="/explore" component={Explore} />

      <Route component={NotFound} />
    </Switch>
  );
}