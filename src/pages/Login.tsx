import { useState } from 'react';
import { Button, Input, Box, FormControl, FormLabel, useToast, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'Test' && password === 'test123') {
      navigate('/users');
    } else {
      toast({
        title: "Login failed.",
        description: "Invalid credentials, please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      height="100vh" 
      background="gray.50"
    >
      <Box width="300px" padding="50px" boxShadow="lg" borderRadius="8px" background="white">
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </FormControl>
        <FormControl id="password" marginTop="4">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </FormControl>
        <Button colorScheme="teal" marginTop="4" onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </Flex>
  );
};

export default Login;
