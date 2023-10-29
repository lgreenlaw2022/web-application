from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from Models import User, List, Task, UserList, ListRelationship, TaskRelationship, db
import json
import bcrypt

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///web-app.db"
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/", methods=["GET"])
def get_api():
    return "Welcome to the task manager application!"


@cross_origin(
    origin="*", headers=["Content- Type", "Authorization"]
)  # TODO: test if this is neccessary
@app.route("/lists/<int:user_id>", methods=["GET"])
def get_lists(user_id):
    if user_id is None:
        return jsonify({"error": "User not found"}), 404
    print("___In api lists get___")

    # Get the list of list_ids for the user
    user_lists = UserList.query.filter_by(user_id=user_id).all()
    list_ids = [ul.list_id for ul in user_lists]

    # Query the List table to get the information for each list
    lists = List.query.filter(List.id.in_(list_ids)).all()

    # Create a list of dictionaries containing the id and title of each list
    list_data = [{"id": lst.id, "title": lst.title} for lst in lists]
    print("api lists for user", user_id, user_lists, list_ids)
    return jsonify(list_data), 200


@app.route("/lists/<int:list_id>/tasks", methods=["GET"])
def get_tasks(list_id):
    print("___GETTING TASK FOR LIST___")
    print("list id", list_id)
    if list_id is None:
        return jsonify({"error": "List not found"}), 404

    list_tasks = ListRelationship.query.filter_by(list_id=list_id).all()
    print("list tasks", list_tasks)
    task_ids = [ul.task_id for ul in list_tasks]
    print("task ids", task_ids)

    tasks = Task.query.filter(Task.id.in_(task_ids)).all()

    # Create a list of dictionaries containing the id and title of each list
    task_data = [{"id": task.id, "title": task.title} for task in tasks]
    print("task data retrieved for the api call", task_data, len(task_data))

    return jsonify({"tasks": task_data, "num_tasks": len(task_data)}), 200


@app.route("/tasks/<int:task_id>/subtasks", methods=["GET"])
def get_subtasks(task_id):
    # Find the task with the specified ID
    print("___GETTING SUBTASKS FOR TASK___", task_id)
    task = Task.query.filter_by(id=task_id).first()

    # If the task exists, get its subtasks
    if task:
        subtask_relationships = TaskRelationship.query.filter_by(
            parent_task_id=task_id
        ).all()
        print("subtask relationships", subtask_relationships)
        subtask_ids = [ul.child_task_id for ul in subtask_relationships]
        print("subtask ids", subtask_ids)

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

    list = List(title=title)
    db.session.add(list)
    db.session.commit()

    return jsonify(list.to_dict(), {"success": True}), 201


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
    print("___in connect to list___")
    data = request.get_json()
    user_id = data.get("user_id")
    list_id = data.get("list_id")
    if not user_id or not list_id:
        return jsonify({"error": "User ID and List ID are required"}), 400

    relationship = UserList(user_id=user_id, list_id=list_id)
    print("added relationship", relationship)
    db.session.add(relationship)
    db.session.commit()

    return jsonify({"success": True}), 201


@app.route("/tasks", methods=["POST"])
def add_task():
    # Get the request data
    data = request.get_json()

    # Extract the task title and list ID from the request data
    title = data.get("title")

    # Create a new task object with the extracted data
    task = Task(title=title)

    # Add the task to the database
    db.session.add(task)
    db.session.commit()

    # Return a success response
    return (
        jsonify(
            {"message": "Task added successfully", "success": True, "task_id": task.id}
        ),
        201,
    )


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
    print("___in create list task relationship___")
    # Get the request data
    data = request.get_json()

    # Extract the list ID and task ID from the request data
    list_id = data.get("list_id")
    task_id = data.get("task_id")

    # Create a new ListTaskRelationship object with the extracted data
    relationship = ListRelationship(list_id=list_id, task_id=task_id)
    print("**************TASK LIST RELATIONSHIP ADDED", relationship)

    # Add the relationship to the database
    db.session.add(relationship)
    db.session.commit()

    # Return a success response
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
    # Get the request data
    data = request.get_json()

    # Extract the parent task ID and child task ID from the request data
    parent_task_id = data.get("parent_task_id")
    child_task_id = data.get("child_task_id")

    # Create a new TaskRelationship object with the extracted data
    relationship = TaskRelationship(
        parent_task_id=parent_task_id, child_task_id=child_task_id
    )

    # Add the relationship to the database
    db.session.add(relationship)
    db.session.commit()

    # Return a success response
    return jsonify({"message": "Task-Subtask Relationship created"}), 201


@app.route("/auth/login", methods=["POST"])
def get_user():
    print("this is being called")
    data = json.loads(request.get_json())
    # data = request.get_json()

    userData = data["userData"]
    password = data["password"]
    print(userData, password)

    if not userData:
        return jsonify({"error": "Username is required"}), 400

    if not password:
        return jsonify({"error": "Password is required"}), 400
    user = (
        db.session.query(User)
        .filter(
            (User.email == userData) | (User.username == userData)
        )  # TODO: email probably shouldn't be case sensitive
        .first()
    )
    print(user)
    if user is None:
        return jsonify({"error": "User doesn't exist"}), 400

    # stored_password = user.password  # TODO: don't need this
    print("Stored password:", user.password)

    if not bcrypt.checkpw(password.encode("utf-8"), user.password):
        print("wrong passwrod")
        return jsonify({"error": "Password is wrong"}), 400

    db.session.commit()
    print("api successfully logged in user", user.id)
    print("user dict", user.id, user.username, user.email, user.password)
    return jsonify({"user": user.id, "message": "User logged in", "success": True}), 201


@app.route("/auth/register", methods=["POST"])
def add_user():
    data = json.loads(request.get_json())
    username = data["username"]
    email = data["email"]
    password = data["password"]
    if not username:
        return jsonify({"error": "Username is required"}), 400
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400
    # salt = password[:29]
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    user = User(username=username, email=email, password=hashed_password)
    print("api successfully added user")
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


# clear all added tasks (for dev only)
def reset_database():
    with app.app_context():
        db.drop_all()
        db.create_all()


@app.route("/reset-database", methods=["GET"])
def reset_db():
    reset_database()
    return "Database reset successfully"
