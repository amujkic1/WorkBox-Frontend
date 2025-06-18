import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AssignUsersToTeams = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:8082/teams');
      const teamsData = response.data._embedded?.teamList || [];
      setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8082/users');
      const usersData = response.data._embedded?.userList || [];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAssign = async (teamId) => {
    const userId = selectedUsers[teamId];
    if (!userId) return;

    try {
      const userRes = await axios.get(`http://localhost:8082/users/${userId}`);
      const user = userRes.data;
      user.team = { id: teamId };

      await axios.put(`http://localhost:8082/users/${userId}`, user);
      alert('User assigned to team successfully');
      fetchUsers();
      fetchTeams();
    } catch (error) {
      console.error('Error assigning user to team:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Assign Users to Teams</h2>

      <Button 
        variant="secondary" 
        className="mb-3"
        onClick={() => navigate('/business')}
      >
        Dashboard
      </Button>

      {teams.map((team) => (
        <Card key={team.id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>{team.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Leader: {team.teamLeader}
            </Card.Subtitle>

            <Card.Text>
              <strong>Members:</strong>
              <ul>
                {users
                  .filter(user => user.team && user.team.id === team.id)
                  .map(user => (
                    <li key={user.id}>{user.firstName} {user.lastName}</li>
                  ))
                }
              </ul>
            </Card.Text>

            <Form.Group controlId={`assignUser-${team.id}`} className="d-flex">
              <Form.Select
                className="me-3"
                onChange={(e) =>
                  setSelectedUsers({ ...selectedUsers, [team.id]: e.target.value })
                }
              >
                <option value="">Select User</option>
                {users
                  .filter(user => user.team === null) 
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                ))}
              </Form.Select>

              <Button
                variant="primary"
                onClick={() => handleAssign(team.id)}
              >
                Assign
              </Button>
            </Form.Group>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default AssignUsersToTeams;
