import { useEffect, useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr, Button, Box, Flex, Heading, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://reqres.in/api/users?page=${page}`);
      const data = await response.json();
      setUsers(data.data);
      setTotalPages(data.total_pages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <Box padding="20px">
      <Heading>User Management Dashboard</Heading>
      <Box marginTop="20px">
        <Link to="/add-user">
          <Button colorScheme="teal">Add User</Button>
        </Link>
      </Box>
      <Box marginTop="20px">
        {isLoading ? (
          <Box>Loading...</Box>
        ) : (
          <Table variant="simple" marginTop="20px">
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
                  <Td><img src={user.avatar} alt={user.first_name} width="50" height="50" /></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        <Flex justify="space-between" marginTop="20px">
          <Button 
            onClick={() => setPage(page - 1)} 
            isDisabled={page === 1}
          >
            Previous
          </Button>
          <Button 
            onClick={() => setPage(page + 1)} 
            isDisabled={page === totalPages}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default UserList;
