import { observer } from "mobx-react-lite";
import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";

const NavBar: React.FC = () => {
  return (
    <div>
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item header as={NavLink} to="/" exact>
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: "10px" }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item name="Activities" as={NavLink} to="/activities" exact />
          <Menu.Item>
            <Button
              positive
              content="Create Activity"
              as={NavLink}
              to="/createActivity"
              exact
            />
          </Menu.Item>
        </Container>
      </Menu>
    </div>
  );
};

export default observer(NavBar);
