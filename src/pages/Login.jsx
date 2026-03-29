import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            const res = await axios.post("https://todo-backend-jxyn.onrender.com/login",
                { email , password }
            )

            localStorage.setItem("token", res.data.token)
            navigate("/tasks")
        } catch (err) {
            alert(err.response.data.message || "Login failed")
        }
    }
    return (
        <div style = {{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px"}}>
            <h2>Login</h2>
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
            <button onClick={handleLogin}>Login</button>

            <p>Dont have an account? <Link to ="Signup">Sign up </Link></p>
        </div>
    )
}

export default Login