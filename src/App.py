from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from Models import User, List, Task, UserList, ListRelationship, TaskRelationship, db
import json
import bcrypt
from sqlalchemy import func

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///web-app.db"
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/", methods=["GET"])
def get_api():
    return "Welcome to the task manager application!"


@cross_origin(origin="*", headers=["Content- Type", "Authorization"])
@app.route("/lists/<int:user_id>", methods=["GET"])
def get_lists(user_id):
    if user_id is None:
        return jsonify({"error": "User not found"}), 404
    # Get the list of list_ids for the user
    user_lists = UserList.query.filter_by(user_id=user_id).all()
    list_ids = [ul.list_id for ul in user_lists]

    # Query the List table to get the information for each list
    lists = List.query.filter(List.id.in_(list_ids)).all()

    # Create a list of dictionaries containing the id and title of each list
    list_data = [{"id": lst.id, "title": lst.title} for lst in lists]
    return jsonify(list_data), 200


@app.route("/lists/<int:list_id>/tasks", methods=["GET"])
def get_tasks(list_id):
    if list_id is None:
        return jsonify({"error": "List not found"}), 404

    list_tasks = ListRelationship.query.filter_by(list_id=list_id).all()
    task_ids = [ul.task_id for ul in list_tasks]

    tasks = Task.query.filter(Task.id.in_(task_ids)).all()

    # Create a list of dictionaries containing the id and title of each list
    task_data = [{"id": task.id, "title": task.title} for task in tasks]

    return jsonify({"tasks": task_data, "num_tasks": len(task_data)}), 200


@app.route("/tasks/<int:task_id>/subtasks", methods=["GET"])
def get_subtasks(task_id):
    # Find the task with the specified ID
    task = Task.query.filter_by(id=task_id).first()

    # If the task exists, get its subtasks
    if task:
        subtask_relationships = TaskRelationship.query.filter_by(
            parent_task_id=task_id
        ).all()
        subtask_ids = [ul.child_task_id for ul in subtask_relationships]

        subtasks = Task.query.filter(Task.id.in_(subtask_ids)).all()
        subtask_data = [
            {"id": subtask.id, "title": subtask.title} for subtask in subtasks
        ]
        return jsonify({"subtasks": subtask_data, "num_subtasks": len(subtasks)}), 200
    else:
        return jsonify({"error": "Task not found", "success": False}), 404


@app.route("/lists", methods=["POST"])
def create_list():
    title = request.json.get("title")

    if not title:
        return jsonify({"error": "Text is required"}), 400

    # Create a new list object with the extracted data
    list = List(title=title)
    db.session.add(list)
    db.session.commit()

    return jsonify(list.to_dict(), {"success": True}), 201


@app.route("/lists/<int:list_id>", methods=["PUT"])
def update_list(list_id):
    new_title = request.json.get("title")
    if new_title is None:
        return jsonify({"message": "Title is required"}), 400

    list = List.query.get(list_id)
    if list is None:
        return jsonify({"message": "List not found"}), 404

    list.title = new_title
    db.session.commit()

    return jsonify({"message": "List renamed", "success": True}), 200


@app.route("/lists/<int:list_id>", methods=["DELETE"])
def delete_list(list_id):
    # Find the list with the specified ID
    list = List.query.filter_by(id=list_id).first()

    # If the list exists, delete it from the database
    if list:
        db.session.delete(list)
        db.session.commit()
        print("api successfully deleted list", list_id)
        return jsonify({"message": "List deleted", "success": True}), 200
    else:
        return jsonify({"error": "List not found", "success": False}), 404


@app.route("/connecttolist", methods=["POST"])
def connect_to_list():
    data = request.get_json()
    user_id = data.get("user_id")
    list_id = data.get("list_id")
    if not user_id or not list_id:
        return jsonify({"error": "User ID and List ID are required"}), 400

    # Create a new UserList object with the extracted data
    relationship = UserList(user_id=user_id, list_id=list_id)
    print("added relationship", relationship)
    db.session.add(relationship)
    db.session.commit()

    return jsonify({"success": True}), 201


@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    # Extract the task title and list ID from the request data
    title = data.get("title")
    # Create a new task object with the extracted data
    task = Task(title=title)
    db.session.add(task)
    db.session.commit()

    return (
        jsonify(
            {"message": "Task added successfully", "success": True, "task_id": task.id}
        ),
        201,
    )


@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    new_title = request.json.get("title")
    if new_title is None:
        return jsonify({"message": "Title is required"}), 400

    task = Task.query.get(task_id)
    if task is None:
        return jsonify({"message": "Task not found"}), 404

    task.title = new_title
    db.session.commit()

    return jsonify({"message": "Task updated", "success": True}), 200


@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    # Find the task with the specified ID
    task = Task.query.filter_by(id=task_id).first()

    # If the task exists, delete it from the database
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted", "success": True}), 200
    else:
        return jsonify({"error": "Task not found", "success": False}), 404


@app.route("/list-task-relationship", methods=["POST"])
def create_list_task_relationship():
    data = request.get_json()

    # Extract the list ID and task ID from the request data
    list_id = data.get("list_id")
    task_id = data.get("task_id")

    # Create a new ListTaskRelationship object with the extracted data
    relationship = ListRelationship(list_id=list_id, task_id=task_id)
    db.session.add(relationship)
    db.session.commit()

    return jsonify({"message": "List-Task Relationship created", "success": True}), 201


@app.route("/delete/parent-task/<int:list_id>/<int:task_id>", methods=["DELETE"])
def delete_list_task_relationship(list_id, task_id):
    # Find the ListRelationship object with the specified list ID and task ID
    relationship = ListRelationship.query.filter_by(
        list_id=list_id, task_id=task_id
    ).first()

    # If the relationship exists, delete it from the database
    if relationship:
        db.session.delete(relationship)
        db.session.commit()
        return (
            jsonify({"message": "List-Task Relationship deleted", "success": True}),
            200,
        )
    else:
        return (
            jsonify({"error": "List-Task Relationship not found", "success": False}),
            404,
        )


@app.route("/task-subtask-relationship", methods=["POST"])
def create_task_subtask_relationship():
    data = request.get_json()

    # Extract the parent task ID and child task ID from the request data
    parent_task_id = data.get("parent_task_id")
    child_task_id = data.get("child_task_id")

    # Create a new TaskRelationship object with the extracted data
    relationship = TaskRelationship(
        parent_task_id=parent_task_id, child_task_id=child_task_id
    )
    db.session.add(relationship)
    db.session.commit()

    return jsonify({"message": "Task-Subtask Relationship created"}), 201


@app.route("/auth/login", methods=["POST"])
def get_user():
    data = json.loads(request.get_json())
    userData = data["userData"]
    password = data["password"]
    # verify all fields are present
    if not userData:
        return jsonify({"message": "Username is required"}), 400

    if not password:
        return jsonify({"message": "Password is required"}), 400

    # check if user exists
    user = (
        db.session.query(User)
        .filter(
            # email is not case sensitive
            (User.email.ilike(func.lower(userData)))
            | (User.username == userData)
        )
        .first()
    )
    if user is None:
        return jsonify({"message": "User doesn't exist", "success": False}), 400

    # check if password is correct using hashing
    if not bcrypt.checkpw(password.encode("utf-8"), user.password):
        return jsonify({"message": "Password is wrong", "success": False}), 400

    db.session.commit()
    print("api successfully logged in user", user.id)
    return jsonify({"user": user.id, "message": "User logged in", "success": True}), 201


@app.route("/auth/register", methods=["POST"])
def add_user():
    data = json.loads(request.get_json())
    username = data["username"]
    email = data["email"]
    password = data["password"]
    # verify all fields are present
    if not username:
        return jsonify({"error": "Username is required"}), 400
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400
    # hash the password before storing it
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    # add the user to the database
    user = User(username=username, email=email, password=hashed_password)
    print("api successfully added user")
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201
