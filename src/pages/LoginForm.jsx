/* eslint-disable no-unused-vars */
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Import your Firebase configuration

const Login = () => {
	const navigate = useNavigate(); // Initialize navigate function
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const handleLogin = (e) => {
		e.preventDefault();

		// Check if passwords match
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		// Create user with email and password
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Successful account creation
				console.log("User created:", userCredential.user);
				navigate("/dashboard"); // Redirect to dashboard after account creation
			})
			.catch((error) => {
				// Handle Errors here
				const errorCode = error.code;
				const errorMessage = error.message;
				setError("Error: " + errorMessage); // Display error message to the user
			});
	};

    return (
        <main>
            
					<div className="flex-1 overflow-auto relative ">
						<div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full mt-24 mr-40 ml-auto">
							<h2 className="text-2xl font-bold mb-4">Login to Your Account</h2>
							<p className="text-sm text-gray-400 mb-6">
								Please fill in the details to login to your account.
							</p>
							<form className="space-y-4" onSubmit={handleLogin}>
								<div>
									<label htmlFor="name" className="block text-sm mb-1">
										Name
									</label>
									<input
										type="name"
										id="name"
										value={name}
										onChange={(e) => setName(e.target.value)} // Bind email input to state
										placeholder="••••••••"
										className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
									/>
								</div>
								<div>
									<label htmlFor="email" className="block text-sm mb-1">
										Email
									</label>
									<input
										type="email"
										id="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)} // Bind email input to state
										placeholder="youremail@example.com"
										className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
									/>
								</div>
								<div>
									<label htmlFor="password" className="block text-sm mb-1">
										Password
									</label>
									<input
										type="password"
										id="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)} // Bind password input to state
										placeholder="••••••••"
										className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
									/>
								</div>
								<div>
									<label
										htmlFor="confirmPassword"
										className="block text-sm mb-1">
										Confirm Password
									</label>
									<input
										type="password"
										id="confirmPassword"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)} // Bind confirm password input to state
										placeholder="••••••••"
										className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
									/>
								</div>
								{error && <p className="text-red-500 text-sm">{error}</p>}
							</form>
							<div className="text-center mt-4 text-sm">
								<a href="/overview" className="text-blue-500">
									Login
								</a>
							</div>
						</div>
					</div>
            
			</main>
		);
};

export default Login;
