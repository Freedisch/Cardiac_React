/* eslint-disable no-unused-vars */
// PredictionModal.js
import React from "react";

const PredictionModal = ({ predictionResult, onClose }) => {
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2>Prediction Result</h2>
				<p>{predictionResult}</p>
				<button onClick={onClose}>Close</button>
			</div>
		</div>
	);
};

export default PredictionModal;
