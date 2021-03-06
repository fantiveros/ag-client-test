import React, { Fragment, useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import EditTodo from "./EditTodo";
import InputTodo from "./InputTodo";
import Switch from "react-switch";

const ListTodos = () => {
  const [todos, setTodos] = useState([]);
  const [displayTodos, setDisplayTodos] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const { loggedUser } = useContext(AuthContext);

  //delete a todo

  const deleteTodo = async (id) => {
    try {
      const deleteTodo = await fetch(`https://ag-server-test.herokuapp.com/todos/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => deleteTodo.todo_id != todo.todo_id));
      window.location.reload();
    } catch (err) {
      console.error(err.message);
    }
  };
  // get and fetch todos
  const getTodos = async () => {
    try {
      const response = await fetch("https://ag-server-test.herokuapp.com/todos");
      const jsonData = await response.json();
      setTodos(jsonData);
      setDisplayTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    if (isPrivate == false) {
      setDisplayTodos(todos);
    } else {
      setDisplayTodos(
        todos.filter((item) => item.user_id == loggedUser.user_id)
      );
    }
  }, [todos]);

  console.log(todos);

  const handleToggle = () => {
    console.log("logged user is: ", loggedUser);
    if (isPrivate == true) {
      setDisplayTodos(todos);
      setIsPrivate(false);
    } else {
      setDisplayTodos(
        todos.filter((item) => item.user_id == loggedUser.user_id)
      );
      setIsPrivate(true);
    }
  };

  // Table for the data
  return (
    <Fragment>
      <div className="text-center bg-white">
        <h1> Todo List</h1>
        <InputTodo todos={todos} setTodos={setTodos} />
      </div>
      <div className="justify-content-end">
        <Switch onChange={handleToggle} checked={isPrivate} />
      </div>
      <table className="table text-center table table table-hover">
        <thead className="thead-light">
          <tr>
            <th scope="colSpan">ID</th>
            <th scope="colSpan">Description</th>
            <th scope="colSpan">Date</th>
            <th scope="colSpan">Time</th>
            <th scope="colSpan">Category</th>
            <th scope="colSpan">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayTodos.map((todo) => (
            <React.Fragment key={todo.todo_id}>
              {" "}
              <tr key={todo.todo_id}>
                <td> {todo.todo_id}</td>
                <td>{todo.description}</td>
                <td> {todo.date.substr(0, 10)}</td>
                <td> {todo.time}</td>
                <td> {todo.category}</td>
                <td>
                  <EditTodo
                    todo={todo}
                    key={todo.todo_id}
                    setTodos={setTodos}
                  />
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTodo(todo.todo_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ListTodos;
