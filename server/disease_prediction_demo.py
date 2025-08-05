#!/usr/bin/env python3
"""
AI-Powered Disease Prediction System
AIIA (AI Institute Africa) - Healthcare Project

This system uses advanced computer vision and machine learning 
to predict skin diseases from medical images.
"""

from gradio_client import Client, handle_file
import logging
import os
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DiseasePredictor:
    """
    AI-powered disease prediction system using Gradio client
    for skin disease detection and classification.
    """
    
    def __init__(self):
        """Initialize the disease prediction client."""
        self.client = None
        self.model_endpoint = "fastinom/Skin_disease"
        self._initialize_client()
    
    def _initialize_client(self) -> None:
        """Initialize the Gradio client connection."""
        try:
            self.client = Client(self.model_endpoint)
            logger.info(f"Successfully connected to {self.model_endpoint}")
        except Exception as e:
            logger.error(f"Failed to initialize client: {e}")
            self.client = None
    
    def predict_disease(self, image_path: str) -> Optional[Dict[str, Any]]:
        """
        Predict disease from medical image.
        
        Args:
            image_path: Path to the medical image file
            
        Returns:
            Dictionary containing prediction results or None if failed
        """
        if not self.client:
            logger.error("Client not initialized")
            return None
        
        try:
            # Handle file input - can be local path or URL
            if image_path.startswith(('http://', 'https://')):
                # Handle URL
                result = self.client.predict(
                    image=handle_file(image_path),
                    api_name="/predict"
                )
            else:
                # Handle local file
                if not os.path.exists(image_path):
                    logger.error(f"Image file not found: {image_path}")
                    return None
                
                result = self.client.predict(
                    image=handle_file(image_path),
                    api_name="/predict"
                )
            
            logger.info("Prediction completed successfully")
            return {
                "status": "success",
                "prediction": result,
                "model": self.model_endpoint,
                "timestamp": str(pd.Timestamp.now()) if 'pd' in globals() else "N/A"
            }
            
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            return {
                "status": "error",
                "error": str(e),
                "model": self.model_endpoint
            }
    
    def batch_predict(self, image_paths: list) -> list:
        """
        Perform batch predictions on multiple images.
        
        Args:
            image_paths: List of image file paths
            
        Returns:
            List of prediction results
        """
        results = []
        for image_path in image_paths:
            result = self.predict_disease(image_path)
            results.append(result)
        
        return results

def main():
    """
    Demo function showing disease prediction system usage.
    """
    # Initialize the predictor
    predictor = DiseasePredictor()
    
    # Example usage with a test image
    test_image_url = 'https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png'
    
    print("🏥 AI Institute Africa - Disease Prediction System")
    print("=" * 50)
    print(f"Testing with image: {test_image_url}")
    
    # Make prediction
    result = predictor.predict_disease(test_image_url)
    
    if result:
        print("\n📊 Prediction Results:")
        print("-" * 30)
        if result["status"] == "success":
            print(f"✅ Status: {result['status']}")
            print(f"🔬 Model: {result['model']}")
            print(f"📈 Prediction: {result['prediction']}")
        else:
            print(f"❌ Status: {result['status']}")
            print(f"🔍 Error: {result['error']}")
    else:
        print("❌ Prediction failed - check logs for details")

if __name__ == "__main__":
    main()