import { useState} from 'react'
import { useNavigate, Link }  from 'react-router-dom'
import axios from 'axios'


function Signup() {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

const handleSignup = async () => {
    try {
        await axios.post("https://todo-backend-jxyn.onrender.com/register", 
            { email,password}
        )
        alert("Signup successful! Please login.")
        navigate("/login")
    } catch (err) {
        alert(err.response.data.message || "Signup failed")
    }
}
    return (
        <div style = {{ display: "center", flexDirection: "column", alignItems: "center", marginTop: "100px"}}>
            <h2>Signup</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />< br/><br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />< br/><br />
            <button onClick={handleSignup}>Signup</button>

            <p>Already have an account? <Link to ="Login">Login </Link></p>
        </div>
    )
}
export default Signup