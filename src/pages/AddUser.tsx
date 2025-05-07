import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useToast, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Flex } from '@chakra-ui/react';
import axios from 'axios';

const AddUser = () => {
  const [newUser, setNewUser] = useState({ name: '', job: '' });
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://reqres.in/api/users',
        {
          name: newUser.name,
          job: newUser.job,
        },
        {
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        }
      );
      toast({
        title: 'User Created',
        description: `User ${response.data.name} with job ${response.data.job} was created successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setNewUser({ name: '', job: '' });
      fetchUsers(currentPage);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box width="80%" margin="auto" padding="20px" boxShadow="lg" borderRadius="8px">
      <Heading as="h3" size="lg" textAlign="center" marginBottom="20px">
        User Management Dashboard
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" marginBottom="4">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Enter name"
            required
          />
        </FormControl>
        <FormControl id="job" marginBottom="4">
          <FormLabel>Job Title</FormLabel>
          <Input
            type="text"
            value={newUser.job}
            onChange={(e) => setNewUser({ ...newUser, job: e.target.value })}
            placeholder="Enter job title"
            required
          />
        </FormControl>
        <Button colorScheme="teal" width="100%" type="submit">
          Add User
        </Button>
      </form>
      <Box marginTop="30px">
        <Heading as="h4" size="md" marginBottom="10px">
          Existing Users
        </Heading>
        {isLoading ? (
          <Flex justify="center">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Avatar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.first_name} {user.last_name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <img src={user.avatar} alt={user.first_name} width="50" height="50" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        <Flex justify="center" marginTop="20px">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            isDisabled={currentPage === 1}
            marginRight="10px"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            isDisabled={isLoading}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default AddUser;
