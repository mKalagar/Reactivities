import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";

interface IProps {
  openCreateForm: () => void;
}

const NavBar: React.SFC<IProps> = ({ openCreateForm }) => {
  return (
    <div>
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item header>
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: "10px" }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item name="Activities" />
          <Menu.Item>
            <Button
              positive
              content="Create Activity"
              onClick={openCreateForm}
            />
          </Menu.Item>
        </Container>
      </Menu>
    </div>
  );
};

export default NavBar;
