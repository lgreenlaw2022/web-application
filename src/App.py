from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

# from flask_restx import Api, Resource, fields

app = Flask(__name__)
CORS(app, support_credentials=True)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///web-app.db"
db = SQLAlchemy(app)

# task_model = api.model(
#     "Task",
#     {
#         "id": fields.Integer(readonly=True, description="The task unique identifier"),
#         "title": fields.String(required=True, description="Task title"),
#         "status": fields.String(
#             required=True, description="Task status"
#         ),  # Done or not done -- indicates styling
#         "subtasks": fields.List(fields.Nested("Subtask")),
#     },
# )


# TODO: make a separate models folder?
class List(db.Model):
    __tablename__ = "list"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    tasks = db.relationship("Task", backref="list", lazy=True)

    __table_args__ = db.UniqueConstraint("id", name="list_id_unique")


class Task(db.Model):
    __tablename__ = "task"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default="To Do")
    subtasks = db.relationship(
        "Task", backref=db.backref("parent_task", remote_side=[id])
    )
    list_id = db.Column(db.Integer, db.ForeignKey("list.id"), nullable=False)

    __table_args__ = db.UniqueConstraint("id", name="task_id_unique")


@app.route("/", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    task_list = [
        {"title": task.title, "status": task.status, "subtasks": task.subtasks}
        for task in tasks
    ]
    return jsonify({"tasks": task_list})


# create a new list
@app.route("/addlist", methods=["POST", "OPTIONS"])
@cross_origin(supports_credentials=True)
def create_list():
    data = request.get_json()
    name = data.get("name")
    # Assume that there are no tasks in the list

    if not name:
        return jsonify({"error": "Name is required"}), 400
    new_list = List(name=name)

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
