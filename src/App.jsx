import { useState, useEffect } from 'react'
import TodoInput  from './components/TodoInput'
import TodoList from './components/TodoList'
import { BrowserRouter as Router, Route, Routes , Navigate} from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'

import axios from 'axios'
import './App.css'

const isAuthenticated = () => !!localStorage.getItem("token")

function App() {

  
  const API_BASE_URL = "https://todo-backend-jxyn.onrender.com"
  //  API_BASE_URL = "https://todo-backend-jxyn.onrender.com"

  const [ task, setTask] = useState("")
  const [day, setDay] = useState("")
  const [time, setTime] = useState("")
  const [ tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks")
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  const [category, setCategory] = useState("")


  //fetch tasks from backend
  useEffect(() => {
    axios.get(`${API_BASE_URL}/tasks`)
    .then(res => setTasks(res.data))
  }, [])
  

   const addTask = async () => {
  console.log("CLICK WORKING") 
    const newTask = {
      text: task,
      day: day,
      time: time,
      category:  category,
      completed: false
    }

    const res = await axios.post(`${API_BASE_URL}/tasks`, newTask)

    setTasks([...tasks, res.data])
   
  }
 
  
       const deleteTask = async (id) => {
        await axios.delete(`${API_BASE_URL}/tasks/${id}`)
        setTasks(tasks.filter(task => task._id !== id))
       }

  
     const toggleComplete = async (task) => {

  console.log("TOGGLE CLICKED")

  try {
    const res = await axios.put(
      `${API_BASE_URL}/tasks/${task._id}`,
      { completed: !task.completed }
    )
  
    
    console.log(res.data)

    setTasks(tasks.map(t => t._id === task._id ? res.data : t))

  } catch (err) {
    console.log("ERROR:", err)
  }
}

    const updateTask = async (id, updatedTask ) => {
      const res = await axios.put(`${API_BASE_URL}/tasks/${id}`, updatedTask)
      setTasks(tasks.map(t => t._id === id ? res.data : t))
    }

    const completedTasks = tasks.filter(task => task.completed).length

    const clearCompleted  = () => {
    
      const activeTasks = tasks.filter(task => !task.completed)
      const completedTasks = tasks.filter(task => task.completed)
      
      setTasks(activeTasks)

  
      completedTasks.forEach(async (t) => {
        try {
          await axios.delete(`${API_BASE_URL}/tasks/${t._id}`, {
            headers: { Authorization: localStorage.getItem("token") }
          })
        } catch (err) {
          console.error("Failed to delete task:", t._id, err)
        }
      })
    }
  return (
    <>
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

        <p>
          Progress: {completedTasks} / {tasks.length}
        </p>
        <div className='progress-bar'>
          <div
          className= "progress-fill"
          style={{width: `${(completedTasks / tasks.length) * 100 || 0 }%`}}
          ></div>
        </div>

        <button onClick={clearCompleted}>
          Clear Completed
        </button>

        <Router>
          <Routes>
            <Route path = "/" element = {<Login />} />
            <Route path = "/signup" element = {<Signup />} />
            <Route path = "/Login" element = {<Login />} />
            <Route path = "/tasks" element = {
              isAuthenticated() ? (
                <TodoList
                  tasks={tasks} deleteTask={deleteTask} 
                  toggleComplete={toggleComplete}
                  updateTask={updateTask} />
              ) : (
                <Navigate to="/" />
              )} />
          </Routes>
        </Router>

       
      </div>
      
    </>
  )
}

export default App
