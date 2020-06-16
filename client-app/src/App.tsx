import React, { useEffect, useState } from "react";
import { Header, Icon, List } from "semantic-ui-react";
import axios from "axios";

function App() {
  const [values, setValues] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/values").then((response) => {
      setValues(response.data);
    });
  }, []);
  return (
    <div>
      <Header as="h2">
        <Icon name="users" />
        <Header.Content>Reactivities </Header.Content>
      </Header>
      <List>
        {values.map((value: any) => (
          <List.Item key={value.id}>{value.name}</List.Item>
        ))}
      </List>
    </div>
  );
}

export default App;
