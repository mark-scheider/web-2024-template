import { useState, useEffect, useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

interface Film {
  id: number;
  title: string;
  description: string;
  isBest: boolean;
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.palette.background.default};
    color: ${(props) => props.theme.palette.text.primary};
    font-family: 'Noto Sans JP', sans-serif;
  }
`;

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Column = styled.div`
  flex: 1;
  padding: 1rem;
`;

const ColumnsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
  }
`;

const StyledListItemText = styled(ListItemText)<{ isBest: boolean }>`
  && {
    font-weight: ${(props) => (props.isBest ? "bold" : "normal")};
  }
`;

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#000',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#303030',
    },
    text: {
      primary: '#fff',
    },
  },
});

function App() {
  const [films, setFilms] = useLocalStorageState<Film[]>("films", {
    defaultValue: [],
  });
  const [newFilmTitle, setNewFilmTitle] = useState("");
  const [newFilmDescription, setNewFilmDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (films.length === 0) {
      const boilerplateFilms = [
        { id: 1, title: "Seven Samurai", description: "A classic Japanese film.", isBest: true },
        { id: 2, title: "Spirited Away", description: "A beautiful animated film.", isBest: true },
        { id: 3, title: "Rashomon", description: "A film that explores the nature of truth.", isBest: false },
        { id: 4, title: "Your Name", description: "A touching story of love and time.", isBest: false },
      ];
      setFilms(boilerplateFilms);
    }
  }, [films, setFilms]);

  const handleAddFilm = () => {
    if (newFilmTitle.trim() !== "" && newFilmDescription.trim() !== "") {
      setFilms([
        ...films,
        { id: Date.now(), title: newFilmTitle.trim(), description: newFilmDescription.trim(), isBest: false },
      ]);
      setNewFilmTitle("");
      setNewFilmDescription("");
    }
  };

  const handleDeleteFilm = (id: number) => {
    setFilms(films.filter((film) => film.id !== id));
  };

  const handleEditFilm = (id: number) => {
    setEditingId(id);
    const filmToEdit = films.find((film) => film.id === id);
    if (filmToEdit) {
      setEditTitle(filmToEdit.title);
      setEditDescription(filmToEdit.description);
    }
  };

  const handleUpdateFilm = (id: number) => {
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      setFilms(
        films.map((film) =>
          film.id === id ? { ...film, title: editTitle.trim(), description: editDescription.trim() } : film
        )
      );
    }
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const bestFilms = useMemo(() => films.filter(film => film.isBest), [films]);
  const allFilms = useMemo(() => films, [films]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <GlobalStyle />
        <AppContainer>
          <Typography variant="h4" component="h1" gutterBottom>
            Film Guide
          </Typography>
          <FormControlLabel
            control={<Switch checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />}
            label="Dark Mode"
          />
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          <Box hidden={tabIndex !== 0}>
            <Typography variant="h5" component="h2" gutterBottom>
              Login
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              margin="normal"
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              margin="normal"
            />
            <StyledButton
              variant="contained"
              color="primary"
              fullWidth
            >
              Login
            </StyledButton>
          </Box>
          <Box hidden={tabIndex !== 1}>
            <Typography variant="h5" component="h2" gutterBottom>
              Register
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              margin="normal"
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              margin="normal"
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Confirm Password"
              type="password"
              margin="normal"
            />
            <StyledButton
              variant="contained"
              color="primary"
              fullWidth
            >
              Register
            </StyledButton>
          </Box>
          <ColumnsContainer>
            <Column>
              <Typography variant="h5" component="h2" gutterBottom>
                Best Films
              </Typography>
              <List>
                {bestFilms.map((film) => (
                  <ListItem key={film.id} dense>
                    {editingId === film.id ? (
                      <>
                        <TextField
                          fullWidth
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleUpdateFilm(film.id)}
                          autoFocus
                        />
                        <TextField
                          fullWidth
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          onBlur={() => handleUpdateFilm(film.id)}
                          multiline
                          rows={4}
                        />
                      </>
                    ) : (
                      <StyledListItemText primary={film.title} secondary={film.description} isBest={film.isBest} />
                    )}
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditFilm(film.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteFilm(film.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Column>
            <Column>
              <Typography variant="h5" component="h2" gutterBottom>
                All Films
              </Typography>
              <List>
                {allFilms.map((film) => (
                  <ListItem key={film.id} dense>
                    {editingId === film.id ? (
                      <>
                        <TextField
                          fullWidth
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleUpdateFilm(film.id)}
                          autoFocus
                        />
                        <TextField
                          fullWidth
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          onBlur={() => handleUpdateFilm(film.id)}
                          multiline
                          rows={4}
                        />
                      </>
                    ) : (
                      <StyledListItemText primary={film.title} secondary={film.description} isBest={film.isBest} />
                    )}
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditFilm(film.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteFilm(film.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Column>
          </ColumnsContainer>
        </AppContainer>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;