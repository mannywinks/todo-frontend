function TodoInput({
    task, 
    setTask,
    day, 
    setDay,
     time, 
     setTime,
     category, 
     setCategory,
      addTask}) {

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addTask()
        }
    }

    return (
        <div>

            <input
            type ="text"
            placeholder="Enter a task"
            value= {task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            />

            <select
            value= {day}
            onChange={(e) => setDay(e.target.value)}
            >
            <option value="">Select a day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
            </select>
           
            <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            />
            <select 
              value = {category}
              onChange = {(e) => setCategory(e.target.value)}
              >
                <option value = "">Category</option>
                <option>Work</option>
                <option>Study</option>
                <option>Personal</option>
              </select>
            <button onClick= {addTask}>Add</button>
        </div>
    )
}

export default TodoInput