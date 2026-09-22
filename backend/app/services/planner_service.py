from datetime import datetime, date
from app import models


def calculate_priority_score(task: models.Task) -> float:
    """
    Higher score = more urgent = scheduled first.
    """
    score = 0.0

    if task.deadline:
        days_left = (task.deadline.date() - date.today()).days
        if days_left < 0:
            score += 100          
        elif days_left == 0:
            score += 80           
        elif days_left <= 2:
            score += 50
        elif days_left <= 5:
            score += 30
        else:
            score += 10
    else:
        score += 5                
    if task.priority == "High":
        score += 30
    elif task.priority == "Medium":
        score += 15
    else:
        score += 5

    if task.course and task.course.difficulty == "Hard":
        score += 20
    elif task.course and task.course.difficulty == "Medium":
        score += 10

    return score


def build_schedule(tasks: list[models.Task], available_hours: float):
    """
    Takes a list of Task objects and available hours,
    returns an ordered list of scheduled slots.
    """
    for task in tasks:
        task.priority_score = calculate_priority_score(task)

    sorted_tasks = sorted(tasks, key=lambda t: t.priority_score, reverse=True)

    schedule = []
    remaining_time = available_hours

    for task in sorted_tasks:
        if remaining_time <= 0:
            break

        hours_needed = task.estimated_hours or 1.0
        allocated = min(hours_needed, remaining_time)

        schedule.append({
            "task_id": task.id,
            "title": task.title,
            "course": task.course.course_name if task.course else None,
            "priority": task.priority,
            "allocated_hours": round(allocated, 2),
            "fully_scheduled": allocated >= hours_needed,
        })

        remaining_time -= allocated

    return schedule
from datetime import timedelta

def assign_time_slots(schedule: list[dict], start_time_str: str = "18:00"):
    """
    Takes the schedule from build_schedule() and assigns clock times,
    starting from start_time_str (default 6:00 PM).
    """
    hour, minute = map(int, start_time_str.split(":"))
    current_time = datetime.now().replace(hour=hour, minute=minute, second=0, microsecond=0)

    for slot in schedule:
        duration = timedelta(hours=slot["allocated_hours"])
        end_time = current_time + duration

        slot["start_time"] = current_time.strftime("%I:%M %p")
        slot["end_time"] = end_time.strftime("%I:%M %p")

        current_time = end_time

    return schedule