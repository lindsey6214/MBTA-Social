import React, { useContext } from "react";
import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/Stack";
import { UserContext } from "../../App";

const Test = () => {
  const user = useContext(UserContext);

  console.log("User Context:", user);

  return (
    <Stack direction="vertical" gap={2}>
      <div className="mx-2">
        <h4>Authenticated User</h4>
      </div>
      <Alert variant="primary" className="mx-2">
        {JSON.stringify(user, null, 2)}
      </Alert>
    </Stack>
  );
};

export default Test;