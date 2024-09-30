import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function App() {
  const [todos, setTodos] = useLocalStorageState<Todo[]>("todos", {
    defaultValue: [],
  });
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo.trim(), done: false },
      ]);
      setNewTodo("");
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleEditTodo = (id: number) => {
    setEditingId(id);
  };

  const handleUpdateTodo = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
    setEditingId(null);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Todo List
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="New Todo"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddTodo}
        style={{ marginTop: "1rem" }}
      >
        Add Todo
      </Button>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id} dense>
            <Checkbox
              edge="start"
              checked={todo.done}
              onChange={() => handleToggleTodo(todo.id)}
            />
            {editingId === todo.id ? (
              <TextField
                fullWidth
                value={todo.text}
                onChange={(e) => handleUpdateTodo(todo.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyPress={(e) => e.key === "Enter" && setEditingId(null)}
                autoFocus
              />
            ) : (
              <ListItemText
                primary={todo.text}
                style={{ textDecoration: todo.done ? "line-through" : "none" }}
              />
            )}
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditTodo(todo.id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
