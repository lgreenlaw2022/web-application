from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask_migrate import Migrate


# from flask_restx import Api, Resource, fields

app = Flask(__name__)
CORS(app, support_credentials=True)
# should this just be the env, base url ??
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///web-app.db"
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from Models import User, List, Task, UserList


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


@app.route("/users/<int:user_id>/lists", methods=["GET"])
def get_lists_for_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    lists = [
        list.to_dict()
        for list in List.query.join(UserList).filter(UserList.user_id == user_id)
    ]
    return jsonify({"data": lists})


# create a new list
@app.route("/addlist", methods=["POST", "OPTIONS"])
@cross_origin(supports_credentials=True)
def create_list():
    data = request.get_json()
    name = data.get("name")
    user_id = data.get("user_id")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_list = List(name=name, user=user)

    db.session.add(new_list)
    db.session.commit()

    return jsonify({"message": "List created successfully"})


# Create a new task
@app.route("/addtask", methods=["POST", "OPTIONS"])
@cross_origin(supports_credentials=True)
def create_task():
    data = request.get_json()
    title = data.get("title")
    status = data.get("status")
    subtasks = data.get("subtasks")

    if not title:
        return jsonify({"error": "Title is required"}), 400
    if not status:
        return jsonify({"error": "Status is required"}), 400
    new_task = Task(title=title, status=status, subtasks=subtasks)
    db.session.add(new_task)
    db.session.commit()

    return jsonify({"message": "Task created successfully"})


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
