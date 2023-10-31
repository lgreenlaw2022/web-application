# TODO List Web App

## Run project

### Start frontend
1. npm install
2. npm start

### Start Backend
1. python3 -m venv venv
2. source venv/bin/activate
3. pip install -r requirements.txt
4. cd src from web-application folder
5. export FLASK_APP=App.py
6. python -m flask run --port=8000  
**Note**: this project is configured to run the backend from port 8000 not 5000.

## Project Information

## Overview
This project uses a combination of React and Flask to create a web application that allows users to create and manage to do lists.

[Loom Video Demonstration](https://www.loom.com/share/060c2ff24f544583bd4d5a33114eb478?sid=e84b5818-f486-4f05-8b63-2638ccea1240)

### Features

1. **User authentication**: Users can create an account and log in and out

2. **List management**: Users can create and delete lists

3. **Task management**: Users can add and delete tasks within their to-do lists.

5. **API integration**: The application uses an API to fetch data from a backend server. The API provides endpoints for user authentication, list and task management.

### Project directories and files
<details>
<summary>Files</summary>

`src`: The main source directory for the application.

`src/components`: A directory containing all the React components used in the application. 
Within this folder is a `css` folder that contains the CSS files for the components.

`src/pages`: A directory containing the React components that make up the pages of the application (login, registration and lists).
Within this folder is a `css` folder with the CSS files for the component. 

`src/contexts`: A directory containing  the React context providers used in the application. This includes an API provider and a user provider.

`src/App.js`: The main entry point for the application. It sets up the routing and renders the appropriate page components based on the current URL. The application defaults to the login page.

`src/App.py`: This is the main entry point for the flask application. The database instance is created and routes for the application functions are defined here. 

`src/Models.py`: This file contains the blueprints for the database of the application.

`.env`: A file containing environment variables used in the application (e.g., API URL, database credentials, etc.).

`package.json`: The project's configuration file, which includes dependencies, scripts, and other metadata.

`README.md`: This file.

</details>

## Frontend overview

The frontend is built using React and Bootstrap. The application uses React Router to manage the routing of the application.

#### Pages
The `ListsPage.js`, `LoginPage.js`, and `RegisterPage.js` components are the pages of the application. These components are rendered based on the current URL by `App.js`.

#### Components
The application is split up into small components that are reused. The top level components are returned by the page. For example `ListsPage.js` uses `Body.js` which then returns the `List.js` component which is made up of many `Task.js` components. 


## Database connection
### API Requests
Requests in the components route through an API provider (context provider) and then to an API Client that makes the appropriate fetch based on the properties of the request. The API provider is used in the components so that any component in the hierarchy can make a request without having to pass the api values. The provider and client also make sure I do not make many fetch calls directly in the components.

#### User Provider
The user provider is a context that also facilitates the login and logout functions. It is used in the components to make API requests to the user management endpoints. Calls go through the provider to the client. This context provider also stores the logged in user in the session storage so it persists until the user logs out. Using a context provider allows for the user to be accessed by any component without having to pass a user prop.

## Database Structure 

The database is designed to store the following. The  blueprints are created in `Models.py` and used by `App.py`.
1. **User**: This model represents a user in the system. It has fields for id, username, email, and password.

2. **TaskRelationship**: This model represents a relationship between two tasks, where one task is the parent of another. It has fields for parent_task_id and child_task_id.

3. **Task**: This model represents a task in the system. It has fields for id and title. It also has relationships to ListRelationship and TaskRelationship models.

4. **List**: This model represents a list in the system. It has fields for id and title. It also has relationships to ListRelationship and UserList models.

5. **ListRelationship**: This model represents a relationship between a list and a parent (top level) task, indicating that the task is in the list. It has fields for list_id and task_id.

6. **UserList**: This model maps the relationship between a user and a list, indicating that the list belongs to the user. It has fields for id, user_id, and list_id.




