from flask import Flask, request, jsonify
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


# @app.route("/users/<int:user_id>/lists", methods=["GET"])
# def get_lists_for_user(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     lists = [
#         list.to_dict()
#         for list in List.query.join(UserList).filter(
#             passwordUserList.user_id == user_id
#         )
#     ]
#     return jsonify({"data": lists})


@app.route("/auth/login", methods=["POST"])
def get_user():
    data = json.loads(request.get_json())
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

    if user is None:
        return jsonify({"error": "User doesn't exist"}), 400

    # salt = user.password[:29]
    # input_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    print()
    stored_password = user.password
    print("Stored password:", stored_password)
    print(
        "Hashed input password:",
        bcrypt.hashpw(password.encode("utf-8"), stored_password),
    )

    if not bcrypt.checkpw(password.encode("utf-8"), stored_password):
        print("wrong passwrod")
        return jsonify({"error": "Password is wrong"}), 400

    db.session.commit()
    print("api successfully logged in user", user.id)
    return jsonify({"user": user.to_dict(), "message": "User logged in"}), 201


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


# # create a new list
# @app.route("/addlist", methods=["POST", "OPTIONS"])
# @cross_origin(supports_credentials=True)
# def create_list():
#     data = request.get_json()
#     name = data.get("name")
#     id = data.get("user_id")

#     if not name:
#         return jsonify({"error": "Name is required"}), 400

#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     new_list = List(name=name, user=user)

#     db.session.add(new_list)
#     db.session.commit()

#     return jsonify({"message": "List created successfully"})


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
