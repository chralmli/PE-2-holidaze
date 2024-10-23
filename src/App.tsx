import React from 'react';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from './muiTheme'

const App: React.FC = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <>
        <CssBaseline />
        <GlobalStyles
        styles={{
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
          html: {
            height: '100%',
          },
          body: {
            height: '100%',
            fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
          },
          '#root': {
            height: '100%',
          },
        }}
      />

      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} /> */}
        </Routes>
      </Router>
      </>
    </ThemeProvider>
    
  );
};

export default App;
