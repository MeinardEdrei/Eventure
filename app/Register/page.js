'use client';

export default function Register() {

    const handleSubmit = () => {
        
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Username"/>
                    <input placeholder="Email"/>
                    <input placeholder="Password"/>
                    <button type="submit">Sign up</button>
                </form>
            </div>
        </div>
    )
}