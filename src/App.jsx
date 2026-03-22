import { useState, useEffect } from 'react'
import TodoInput  from './components/TodoInput'
import TodoList from './components/TodoList'
import axios from 'axios'
import './App.css'

function App() {

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
    axios.get('http://localhost:5000/tasks')
    .then(res => setTasks(res.data))
  }, [])
  
  

  //  const addTask = async () => {
  //   if(task === " ") 
   const addTask = async () => {
  console.log("CLICK WORKING") 
    const newTask = {
      text: task,
      day: day,
      time: time,
      category:  category,
      completed: false
    }

    const res = await axios.post('http://localhost:5000/tasks', newTask)

    setTasks([...tasks, res.data])
   
  }
 
    // const deleteTask = (indexToDelete) => {
    //   const updatedTasks = tasks.filter((task,index) => index !== indexToDelete)
    //   setTasks(updatedTasks)
    // }

       const deleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/tasks/${id}`)
        setTasks(tasks.filter(task => task._id !== id))
       }


    // const toggleComplete = async (id) => {
    //   const updatedTasks = tasks.map((task) => {
    //     if(task._id === id) {
    //       return {...task, completed: !task.completed}
    //     }
    //     return task
    //   })
    //   setTasks(updatedTasks)
    // }

     const toggleComplete = async (task) => {

  console.log("TOGGLE CLICKED")

  const updatedTask = {
    ...task,
    completed: !task.completed
  }

  try {
    const res = await axios.put(
      `http://localhost:5000/tasks/${task._id}`,
      updatedTask
    )

    console.log(res.data) // 👈 add this

    setTasks(tasks.map(t => t._id === task._id ? res.data : t))

  } catch (err) {
    console.log("ERROR:", err)
  }
}

    const updateTask = async (id, updatedTask ) => {
      const res = await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask)
      setTasks(tasks.map(t => t._id === id ? res.data : t))
    }

    const completedTasks = tasks.filter(task => task.completed).length

    const clearCompleted  = () => {

      const activeTasks = tasks.filter(task => !task.completed)

      setTasks(activeTasks)

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

       
      </div>
      
    </>
  )
}

export default App
