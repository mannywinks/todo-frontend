import TodoItem from "./TodoItem";

function TodoList({tasks, deleteTask, toggleComplete, updateTask}) {

    return(
        <ul>
            {tasks.map((task) => (
                <TodoItem
                    key={task._id}
                    task={task}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                    toggleComplete={toggleComplete}
                    />
            ))}
        </ul>
    )
}
export default TodoList