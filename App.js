import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const API_BASE_URL = 'https://dummy.restapiexample.com/api/v1';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeSalary, setEmployeeSalary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      setEmployees(data.data);
    } catch (error) {
      setErrorMessage('Error fetching employees.');
    } finally {
      setIsLoading(false);
    }
  };

  const addEmployee = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: employeeName,
          salary: employeeSalary,
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setEmployeeName('');
        setEmployeeSalary('');
        fetchEmployees();
      } else {
        setErrorMessage('Error adding employee.');
      }
    } catch (error) {
      setErrorMessage('Error adding employee.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchEmployees();
      } else {
        setErrorMessage('Error deleting employee.');
      }
    } catch (error) {
      setErrorMessage('Error deleting employee.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Employee Name"
              value={employeeName}
              onChangeText={setEmployeeName}
            />
            <TextInput
              style={styles.input}
              placeholder="Employee Salary"
              value={employeeSalary}
              onChangeText={setEmployeeSalary}
              keyboardType="numeric"
            />
            <Button title="Add Employee" onPress={addEmployee} />
          </View>
          <View style={styles.employeeList}>
            {employees.map((employee) => (
              <View style={styles.employeeItem} key={employee.id}>
                <Text>{employee.employee_name}</Text>
                <Text>Salary: {employee.employee_salary}</Text>
                <Button title="Delete"onPress={() => deleteEmployee(employee.id)} />
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  employeeList: {
    flex: 1,
    width: '100%',
  },
  employeeItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default App;

