"use client";
import "../css/Login-Signup.css";


export default function Register() {
  const handleSubmit = () => {};

  return (
    <div className="LogIn flex flex-col items-center justify-center">
      <div className="Main-cntr flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit}>
          <h1 className="title1">Welcome!</h1>
          <div className="input-cntr">
            <div>
              <input placeholder="Username" />
            </div>
            <div>
              <input placeholder="Email" />
            </div>
            <div>
              <input placeholder="Password" />
            </div>
            <div>
              <input placeholder="Verify Password" />
            </div>
            <button type="submit">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
