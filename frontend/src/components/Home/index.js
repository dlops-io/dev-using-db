import React, { useEffect, useRef, useState } from 'react';
import { Divider, withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import DataService from "../../services/DataService";
import styles from './styles';


const Blank = (props) => {
    const { classes } = props;

    console.log("================================== Blank ======================================");


    // Component States
    const [text, setText] = useState("");
    const [todoItems, setTodoItems] = useState([]);
    const [todoItemsWS, setTodoItemsWS] = useState([]);
    const loadTodoItems = () => {
        DataService.GetTodos()
            .then(function (response) {
                setTodoItems(response.data);
            })
    }
    const loadTodoItemsWS = () => {
        DataService.GetTodos()
            .then(function (response) {
                setTodoItemsWS(response.data);
            })
    }

    // Setup Component
    useEffect(() => {
        loadTodoItems();
        // // Websocket
        // var ws = new WebSocket("ws://localhost:9000/ws");
        // ws.onmessage = function (event) {
        //     //console.log(event.data);
        //     setTodoItemsWS(event.data);
        //     console.log(todoItemsWS);
        // };

        // setInterval
        const timeout = setInterval(() => {
            loadTodoItemsWS();
        }, 5000);

        return () => clearInterval(timeout);
    }, []);

    // Handlers
    const handleOnAddTodo = () => {
        console.log(text)

        let obj = {
            "task": text
        }
        DataService.CreateTodo(obj)
            .then(function (response) {
                setText("");
                loadTodoItems();
            });
    }




    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false} className={classes.container}>

                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Typography variant="h5" gutterBottom>Todo Items</Typography>

                            <Divider />
                            <br />
                            <TextField

                                label="Todo item"
                                multiline
                                rowsMax="4"
                                variant="outlined"
                                fullWidth
                                value={text}
                                onChange={(event) => setText(event.target.value)}
                            />
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={() => handleOnAddTodo()}>
                                Add
                            </Button>

                            <List>
                                {todoItems && todoItems.map((item, idx) =>
                                    <ListItem key={idx}>
                                        <ListItemIcon><Icon>check_box_outline_blank</Icon></ListItemIcon>
                                        <ListItemText primary={item.task} />
                                    </ListItem>
                                )}
                            </List>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="h5" gutterBottom>Todo Items from Web Sockets</Typography>
                            <Divider />
                            <br />
                            <List>
                                {todoItemsWS && todoItemsWS.map((item, idx) =>
                                    <ListItem key={idx}>
                                        <ListItemIcon><Icon>check_box_outline_blank</Icon></ListItemIcon>
                                        <ListItemText primary={item.task} />
                                    </ListItem>
                                )}
                            </List>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Blank);