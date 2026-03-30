import { useState, useEffect } from 'react'
import TodoInput  from './components/TodoInput'
import TodoList from './components/TodoList'
import { BrowserRouter as Router, Route, Routes , Navigate} from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'

import axios from 'axios'
import './App.css'

function App() {

  const API_BASE_URL = "https://todo-backend-jxyn.onrender.com"
  const token = localStorage.getItem("token")
  const isAuthenticated = !!token

  const getAuthHeaders = () => ({
    headers: { Authorization: localStorage.getItem("token") }
  })

  const [ task, setTask] = useState("")
  const [day, setDay] = useState("")
  const [time, setTime] = useState("")
  const [ tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks")
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch (e) {
      return []
    }
  })
  const [category, setCategory] = useState("")


  //fetch tasks from backend
  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${API_BASE_URL}/tasks`, getAuthHeaders())
        .then(res => {
          if (Array.isArray(res.data)) {
            setTasks(res.data)
          }
        })
        .catch(err => console.error("Failed to fetch tasks", err))
    }
  }, [isAuthenticated])
  

   const addTask = async () => {
    try {
      const newTask = {
        text: task,
        day: day,
        time: time,
        category:  category,
        completed: false
      }
      const res = await axios.post(`${API_BASE_URL}/tasks`, newTask, getAuthHeaders())
      setTasks([...tasks, res.data])
      setTask("") // clear input after adding
    } catch (err) {
      console.error("Add error:", err)
    }
  }
 
  
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`, getAuthHeaders())
      setTasks(tasks.filter(task => task._id !== id))
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  
  const toggleComplete = async (task) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/tasks/${task._id}`,
      { completed: !task.completed },
      getAuthHeaders()
    )
    setTasks(tasks.map(t => t._id === task._id ? res.data : t))
  } catch (err) {
    console.log("ERROR:", err)
  }
}

    const updateTask = async (id, updatedTask ) => {
      try {
        const res = await axios.put(`${API_BASE_URL}/tasks/${id}`, updatedTask, getAuthHeaders())
        setTasks(tasks.map(t => t._id === id ? res.data : t))
      } catch (err) {
        console.error("Update error:", err)
      }
    }

    const clearCompleted  = () => {
    
      const activeTasks = tasks.filter(task => !task.completed)
      const completedTasks = tasks.filter(task => task.completed)
      
      setTasks(activeTasks)
  
      completedTasks.forEach(async (t) => {
        try {
          await axios.delete(`${API_BASE_URL}/tasks/${t._id}`, getAuthHeaders())
        } catch (err) {
          console.error("Failed to delete task:", t._id, err)
        }
      })
    }
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/tasks" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/tasks"
          element={
            isAuthenticated ? (
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
                <button onClick={clearCompleted}>
                  Clear Completed
                </button>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
