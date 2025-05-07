import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useToast, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Flex } from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const fetchUsers = async ({ queryKey }: { queryKey: [string, number] }) => {
  const [, page] = queryKey; 
  const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
  return response.data;
};

const addUser = async (newUser: { name: string; job: string }) => {
  const response = await axios.post('https://reqres.in/api/users', newUser, {
    headers: {
      'x-api-key': 'reqres-free-v1',
    },
  });
  return response.data;
};

const AddUser = () => {
  const [newUser, setNewUser] = useState({ name: '', job: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: fetchUsers,
    keepPreviousData: true,
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to load users. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: (data) => {
      toast({
        title: 'User Created',
        description: `User ${data.name} with job ${data.job} was created successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setNewUser({ name: '', job: '' });
      queryClient.invalidateQueries({ queryKey: ['users', currentPage] }); 
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create user. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(newUser);
  };

  const users = data?.data || [];
  const totalPages = data?.total_pages || 0;

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
        <Button colorScheme="teal" width="100%" type="submit" isLoading={mutation.isLoading}>
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
        ) : isError ? (
          <Box>Error loading users.</Box>
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
              {users.map((user: any) => (
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
            marginRight="10px"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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