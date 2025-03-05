import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import { FaTrash } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import bg from "./assets/bg.jpg";



const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function updateTodo(todo: Schema["Todo"]["type"]) {
    const updatedContent = window.prompt("Update your task:", todo.content ?? ""); 
    if (updatedContent && updatedContent.trim() !== "") { 
      client.models.Todo.update({ id: todo.id, content: updatedContent });
    }
  }
  

  return (
    <main 
    style={{
      backgroundImage: `url(${bg})`,
    }}
      >
      <h1>{user?.signInDetails?.loginId}'s Todos</h1>

      <button onClick={createTodo}>+ Add a new task</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span>{todo.content}</span>
            <div className="icons">
              <MdModeEdit className="edit-icon" onClick={() => updateTodo(todo)} />
              <FaTrash className="delete-icon" onClick={() => deleteTodo(todo.id)} />
            </div>
          </li>
        ))}
      </ul>

      <div className="tagline">🚀 TodoApp – Plan. Prioritize. Conquer! ✅</div>

      <button onClick={signOut}>Sign out</button>
    </main>
  );

}

export default App;
