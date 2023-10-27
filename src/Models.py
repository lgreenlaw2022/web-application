from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(
        db.String(50), unique=True, nullable=False
    )  # TODO should this have a unique constraint?
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def to_dict(self):
        return {
            "user_id": self.id,
            "username": self.username,
            "email": self.email,
            "password": self.password.decode("utf-8"),
        }


class Task(db.Model):
    __tablename__ = "task"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)

    __table_args__ = (db.UniqueConstraint("id", name="task_id_unique"),)


class TaskRelationship(db.Model):
    __tablename__ = "task_relationship"
    parent_task_id = db.Column(db.Integer, db.ForeignKey("task.id"), primary_key=True)
    child_task_id = db.Column(db.Integer, db.ForeignKey("task.id"), primary_key=True)

    def __init__(self, parent_task_id, child_task_id):
        self.parent_task_id = parent_task_id
        self.child_task_id = child_task_id


class List(db.Model):
    __tablname__ = "list"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), unique=True, nullable=False)

    def __init__(self, title, *args, **kwargs):
        super(List, self).__init__(*args, **kwargs)
        self.title = title

    def to_dict(self):
        return {
            "list_id": self.id,
            "title": self.title,
        }


class ListRelationship(db.Model):
    __tablename__ = "list_relationship"
    list_id = db.Column(db.Integer, db.ForeignKey("list.id"), primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey("task.id"), primary_key=True)

    def __init__(self, list_id, task_id):
        self.list_id = list_id
        self.task_id = task_id


class UserList(db.Model):
    __tablename__ = "user_list"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey("list.id"), nullable=False)

    user = db.relationship("User", backref=db.backref("user_lists", lazy=True))
    list = db.relationship("List", backref=db.backref("user_lists", lazy=True))

    def __init__(self, user, list):
        self.user = user
        self.list = list
