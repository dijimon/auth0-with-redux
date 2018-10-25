import { BrowserRouter } from 'react-router-dom';
import React, { Component } from 'react';
import Grid from './Components/Grid/index.js'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Grid />
            </BrowserRouter>
        );
    }
}

export default App