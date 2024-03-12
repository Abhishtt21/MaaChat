import React, { useContext, useState } from "react";
import { Container, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useLoginUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Make sure the path is correct
import { AppContext } from "../context/appContext";
import logoImage from "../assets/Lovepik_com-401043824-hand-painted-elements-of-pregnant-women.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  function handleLogin(e) {
    e.preventDefault();
    // login logic
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        // socket work
        socket.emit("new-user");
        // navigate to the chat
        navigate("/chat");
      }
    });
  }

  return (
    <Container className="login__container">
      <Row>
        <Col md={5} className="login__form-container">
          <h2 className="login__heading">Login</h2>
          <Form style={{ maxWidth: 500 }} onSubmit={handleLogin}>
            {error && <p className="alert alert-danger">{error.data}</p>}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
            </Form.Group>

            <Button variant="primary" type="submit">
              {isLoading ? <Spinner animation="grow" /> : "Login"}
            </Button>

            <div className="py-4">
              <p className="text-center">
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={7} className="login__image-container">
          <img src={logoImage} alt="Logo" className="login__logo" />
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
