from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from Models import User, List, Task, UserList, db
import json
import bcrypt

app = Flask(__name__)
CORS(app, support_credentials=True)
# should this just be the env, base url ??
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///web-app.db"
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/", methods=["GET"])
def get_tasks():
    return "Welcome to the task manager application!"


# @app.route("/", methods=["GET"])
# def get_tasks():
#     tasks = Task.query.all()
#     task_list = [
#         {"title": task.title, "status": task.status, "subtasks": task.subtasks}
#         for task in tasks
#     ]
#     return jsonify({"tasks": task_list})


@app.route("/lists/<int:user_id>")
def get_lists(user_id):
    # user = User.query.get(user_id)
    if user_id is None:
        return jsonify({"error": "User not found"}), 404

    lists = List.query.filter_by(user_id=user_id).all()
    return jsonify([list.to_dict() for list in lists]), 200


@app.route("/lists", methods=["POST"])
def create_list():
    title = request.json.get("title")

    if not title:
        return jsonify({"error": "Text is required"}), 400

    list = List(title=title)
    db.session.add(list)
    db.session.commit()

    return jsonify(list.to_dict()), 201


@app.route("/connecttolist", methods=["POST"])
def connect_to_list():
    user_id = request.json.get("userId")
    list_id = request.json.get("listId")
    if not user_id or not list_id:
        return jsonify({"error": "User ID and List ID are required"}), 400

    relationship = UserList(user_id=user_id, list_id=list_id)
    print("added relationship", relationship)
    db.session.add(relationship)
    db.session.commit()

    return jsonify(relationship.to_dict(), {"success": True}), 201


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

    stored_password = user.password  # TODO: don't need this
    print("Stored password:", stored_password)
    # print(
    #     "Hashed input password:",
    #     bcrypt.hashpw(password.encode("utf-8"), stored_password),
    # )
    if not bcrypt.checkpw(password.encode("utf-8"), stored_password):
        print("wrong passwrod")
        return jsonify({"error": "Password is wrong"}), 400

    db.session.commit()
    print("api successfully logged in user", user.id)
    print("user dict", user.id, user.username, user.email, user.password)
    return jsonify({"user": user.id, "message": "User logged in", "success": True}), 201
    # return jsonify({"user": {"id": user.id}, "message": "User logged in"})
    # return jsonify({"user": user.to_dict(), "message": "User logged in"}), 201


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

    user = User(
        username=username, email=email, password=hashed_password.decode("utf-8")
    )
    print("api successfully added user")
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


# # Create a new task
# @app.route("/addtask", methods=["POST", "OPTIONS"])
# @cross_origin(supports_credentials=True)
# def create_task():
#     data = request.get_json()
#     title = data.get("title")
#     status = data.get("status")
#     subtasks = data.get("subtasks")

#     if not title:
#         return jsonify({"error": "Title is required"}), 400
#     if not status:
#         return jsonify({"error": "Status is required"}), 400
#     new_task = Task(title=title, status=status, subtasks=subtasks)
#     db.session.add(new_task)
#     db.session.commit()

#     return jsonify({"message": "Task created successfully"})


# Additional endpoints for further development below
# Update a task by ID
"""
@api.response(404, "Task not found")
class TaskDetail(Resource):
    # @api.expect(task_model)
    def put(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {"error": "Task not found"}, 404
        data = request.get_json()
        task.title = data.get("title", task.title)
        task.status = data.get("status", task.status)
        db.session.commit()
        return {"message": "Task updated successfully"}

    @api.response(204, "Task deleted successfully")
    def delete(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {"error": "Task not found"}, 404
        db.session.delete(task)
        db.session.commit()
        return "", 204


# clear all added tasks (for dev only)
def reset_database():
    with app.app_context():
        db.drop_all()
        db.create_all()


@app.route("/reset-database", methods=["GET"])
def reset_db():
    reset_database()
    return "Database reset successfully"
"""

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
