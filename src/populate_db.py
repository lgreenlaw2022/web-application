from App import app, db
from Models import User, List, UserList, Task

with app.app_context():
    my_list = List(title="My List")
    db.session.add(my_list)
    db.session.commit()

    task1 = Task(title="Task 1", parent_list_id=my_list.id)
    task2 = Task(title="Task 2", parent_list_id=my_list.id)
    db.session.add(task1)
    db.session.add(task2)
    db.session.commit()

# # create a list
# my_list = List(name="My List")
# db.session.add(my_list)
# db.session.commit()

# # create some tasks
# task1 = Task(title="Task 1", list=my_list)
# task2 = Task(title="Task 2", list=my_list)
# task3 = Task(title="Task 3", list=my_list)
# db.session.add_all([task1, task2, task3])
# db.session.commit()

# # create a parent task
# parent_task = Task(title="Parent Task", list=my_list)
# db.session.add(parent_task)
# db.session.commit()

# # create a subtask
# subtask = Task(title="Subtask", parent=parent_task)
# db.session.add(subtask)
# db.session.commit()

# # create a new list
# my_list_2 = List(name="My List 2")
# db.session.add(my_list_2)
# db.session.commit()

# # create a new task and associate it with the list
# my_task = Task(title="My Task", list=my_list)
# db.session.add(my_task)
# db.session.commit()
