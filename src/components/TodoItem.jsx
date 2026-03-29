import { useState , useEffect } from "react";

import axios from "axios";




function TodoItem({task , deleteTask, toggleComplete, updateTask, setTasks}) {
    

    const [isEditing, setIsEditing] = useState(false)
    const [newText, setNewText] = useState(task.text)

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token")
            try {
                const res = await axios.get("https://todo-backend-jxyn.onrender.com/verify", {
            headers: { Authorization: `Bearer ${token}`}
        })
        setTasks(res.data)
           } catch (err){
            console.error("Error verifying token:", err)
           }
        }
        fetchTasks()
            },[])

  
     
    return (
        <li className={`task ${task.completed ? "completed" : ""}`}>

            <div onClick={() => toggleComplete(task)}>

                <span className="check">
                    {task.completed ? "✓" : ""}
                </span>

                <span className ="task-test">
                    {task.text}
                </span>
                {isEditing ? (
                    <input
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        onClick={(e) => e.stopPropagation()} // Prevent toggling completion while typing
                    />
                ) : (
                    <span className ="task-test">
                        {task.text}
                    </span>
                )}

                <small>
                    {task.day} ~ {task.time} ~ {task.category}
                </small>
            </div>
            

            <div>
                {
                    isEditing ? (
                        <><>
                            <input
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)} />
                            <button onClick={() => {
                                updateTask(task._id, { text: newText });
                                setIsEditing(false);
                            } }>
                                Save
                            </button>
                        </><button onClick={() => {
                            updateTask(task._id, { text: newText });
                            setIsEditing(false);
                        } }>
                                Save
                            </button></>
                    ) : (
                        <>
                        <span onClick = {() => toggleComplete(task)}>
                        {task.text}
                        </span>
                        
                        <button onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                        </>
          
             )}
             <button onClick ={() => {
                localStorage.removeItem('token')
                window.location.href = "/"
             }}>
                Logout
             </button>

            <button onClick={() => deleteTask(task._id)}>
                Delete
            </button>
            </div>
        </li>
    )}

export default TodoItem