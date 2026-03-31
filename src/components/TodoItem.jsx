import { useState } from "react";

function TodoItem({task , deleteTask, toggleComplete, updateTask}) {

    const [isEditing, setIsEditing] = useState(false)
    const [newText, setNewText] = useState(task.text)

    return (
        <li className={`task ${task.completed ? "completed" : ""}`}>
            <div onClick={() => toggleComplete(task)}>
                <span className="check">
                    {task.completed ? "✓" : ""}
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
                {isEditing ? (
                    <>
                        <button onClick={() => {
                            updateTask(task._id, { text: newText });
                            setIsEditing(false);
                        }}>
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                    </>
             )}
            <button onClick={() => deleteTask(task._id)}>
                Delete
            </button>
            </div>
        </li>
    )}

export default TodoItem