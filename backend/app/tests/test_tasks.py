import pytest


async def get_token(client):
    await client.post("/auth/register", json={
        "email": "testuser@gmail.com",
        "password": "testpass"
    })
    response = await client.post("/auth/login", data={
        "username": "testuser@gmail.com",
        "password": "testpass"
    })
    return response.json()["access_token"]


@pytest.fixture(scope="session")
async def token(client):
    return await get_token(client)


async def test_create_task(client, token):
    response = await client.post(
        "/tasks/",
        json={
            "title": "Test task",
            "description": "Test description",
            "status": "todo"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Test task"
    assert response.json()["status"] == "todo"


async def test_filter_tasks(client, token):
    await client.post(
        "/tasks/",
        json={
            "title": "Filter test task",
            "status": "in_progress"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    response = await client.get(
        "/tasks/?status=in_progress",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) > 0
    assert all(t["status"] == "in_progress" for t in tasks)


async def test_create_note(client, token):
    task_response = await client.post(
        "/tasks/",
        json={
            "title": "Task for note",
            "status": "todo"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = task_response.json()["id"]

    response = await client.post(
        f"/tasks/{task_id}/notes/",
        json={
            "content": "This is a test note",
            "note_type": "user"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["content"] == "This is a test note"
    assert response.json()["task_id"] == task_id