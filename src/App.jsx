import { useState, useEffect } from 'react'
import TodoInput  from './components/TodoInput'
import TodoList from './components/TodoList'

import axios from 'axios'
import './App.css'

function App() {
  const API_BASE_URL = "https://todo-backend-jxyn.onrender.com"

  const [ task, setTask] = useState("")
  const [day, setDay] = useState("")
  const [time, setTime] = useState("")
  const [ tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks")
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch (err) {
      console.error("Error loading tasks from localStorage", err)
      return []
    }
  })
  const [category, setCategory] = useState("")

  // Sync tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  //fetch tasks from backend
  useEffect(() => {
    axios.get(`${API_BASE_URL}/tasks`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setTasks(res.data)
        }
      })
      .catch(err => console.error("Failed to fetch tasks", err))
  }, []) 

   const addTask = async () => {
    try {
      const newTask = {
        text: task,
        day: day,
        time: time,
        category:  category,
        completed: false
      }
      const res = await axios.post(`${API_BASE_URL}/tasks`, newTask)
      setTasks([...tasks, res.data])
      setTask("") // clear input after adding
    } catch (err) {
      console.error("Add error:", err)
    }
  }
 
  
  const deleteTask = async (id) => {
    if (!id) {
      // If task has no ID, it's a local ghost task, just filter it out
      setTasks(tasks.filter(t => t._id !== id))
      return
    }
    try {
      const targetId = id._id || id;
      await axios.delete(`${API_BASE_URL}/tasks/${targetId}`)
      setTasks(tasks.filter(t => t._id !== targetId))
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const toggleComplete = async (todo) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tasks/${todo._id}`,
        { completed: !todo.completed }
      )
      setTasks(tasks.map(t => t._id === todo._id ? res.data : t))
    } catch (err) {
      console.error("Toggle error:", err)
    }
  }

  const updateTask = async (id, updatedTask) => {
    try {
      const targetId = id._id || id;
      const res = await axios.put(`${API_BASE_URL}/tasks/${targetId}`, updatedTask)
      setTasks(tasks.map(t => (t._id === targetId || t.id === targetId) ? res.data : t))
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  const clearCompleted = () => {
    const activeTasks = tasks.filter(t => !t.completed)
    const completedTasks = tasks.filter(t => t.completed)

    setTasks(activeTasks)

    completedTasks.forEach(async (t) => {
      try {
        await axios.delete(`${API_BASE_URL}/tasks/${t._id}`)
      } catch (err) {
        console.error("Failed to delete task:", t._id, err)
      }
    })
  }

  return (
    <div>
      <h1>My Todo App</h1>
      <TodoInput
        task={task}
        setTask={setTask}
        day={day}
        setDay={setDay}
        time={time}
        setTime={setTime}
        category={category}
        setCategory={setCategory}
        addTask={addTask}
      />
      <p>Total Tasks: {tasks.length}</p>
      <TodoList
        tasks={tasks}
        deleteTask={deleteTask}
        toggleComplete={toggleComplete}
        updateTask={updateTask}
      />
      <button onClick={clearCompleted} type="button">
        Clear Completed
      </button>
    </div>
  )
}

export default App
