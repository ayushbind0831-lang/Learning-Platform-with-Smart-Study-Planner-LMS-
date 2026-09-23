from datetime import date
from app import models


def generate_live_reminders(tasks: list[models.Task]):
    reminders = []

    for task in tasks:
        if task.status == "Completed":
            continue
        if not task.deadline:
            continue

        days_left = (task.deadline.date() - date.today()).days

        if days_left < 0:
            reminders.append({
                "task_id": task.id,
                "message": f"'{task.title}' is overdue!",
                "type": "overdue",
            })
        elif days_left == 0:
            reminders.append({
                "task_id": task.id,
                "message": f"'{task.title}' is due today!",
                "type": "due_today",
            })
        elif days_left == 1:
            reminders.append({
                "task_id": task.id,
                "message": f"'{task.title}' is due tomorrow.",
                "type": "due_soon",
            })

        if task.priority == "High" and task.status == "Pending":
            reminders.append({
                "task_id": task.id,
                "message": f"High-priority task '{task.title}' is still pending.",
                "type": "high_priority_pending",
            })

    return reminders