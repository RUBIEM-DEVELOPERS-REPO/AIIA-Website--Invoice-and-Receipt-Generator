import sys
import json
import cv2
import easyocr
import numpy as np
from PIL import Image
import os
import traceback
import logging
from typing import Tuple

def setup_logging():
    """Configure logging to write to stderr for debugging"""
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(levelname)s - %(message)s',
        stream=sys.stderr
    )
    return logging.getLogger(__name__)

logger = setup_logging()

def resize_image(image: Image.Image, max_size: int = 1024) -> Tuple[Image.Image, float]:
    """Resize image while maintaining aspect ratio"""
    ratio = min(max_size / image.width, max_size / image.height)
    if ratio >= 1:
        return image, 1.0

    new_width = int(image.width * ratio)
    new_height = int(image.height * ratio)
    resized = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    return resized, ratio

def verify_document(image_path: str, full_name: str):
    try:
        # Log environment information
        logger.info(f"Starting document verification for image: {image_path}")
        logger.info(f"Python version: {sys.version}")
        logger.info(f"Current working directory: {os.getcwd()}")
        logger.info(f"PYTHONPATH: {os.environ.get('PYTHONPATH', 'Not set')}")

        # Verify file exists and is accessible
        if not os.path.exists(image_path):
            logger.error(f"Image file not found at path: {image_path}")
            return {
                "isId": False,
                "nameMatch": False,
                "confidence": "none",
                "type": "Free Membership",
                "error": f"Image file not found at path: {image_path}",
                "detectedText": {
                    "words": [],
                    "foundIdIndicators": [],
                    "foundNameParts": [],
                    "completeText": ""
                }
            }

        # Process and validate image
        try:
            logger.info("Opening and validating image...")
            with Image.open(image_path) as img:
                # Check format
                if img.format not in ['JPEG', 'PNG', 'TIFF']:
                    raise ValueError(f"Unsupported image format: {img.format}")

                logger.info(f"Original image dimensions: {img.width}x{img.height}")
                logger.info(f"Image format: {img.format}")

                # Resize image if needed
                resized_img, scale_ratio = resize_image(img)
                logger.info(f"Resized image dimensions: {resized_img.width}x{resized_img.height}")

                # Convert to RGB if necessary
                if resized_img.mode != 'RGB':
                    resized_img = resized_img.convert('RGB')

                # Convert to numpy array for OpenCV
                image_cv = np.array(resized_img)

        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            logger.error(traceback.format_exc())
            return {
                "isId": False,
                "nameMatch": False,
                "confidence": "none",
                "type": "Free Membership",
                "error": f"Error processing image: {str(e)}",
                "detectedText": {
                    "words": [],
                    "foundIdIndicators": [],
                    "foundNameParts": [],
                    "completeText": ""
                }
            }

        # Initialize EasyOCR with optimized settings
        try:
            logger.info("Initializing EasyOCR reader...")
            reader = easyocr.Reader(
                ['en'],
                gpu=False,
                model_storage_directory=os.path.join(os.getcwd(), 'server', 'models'),
                download_enabled=True,
                verbose=False
            )
            logger.info("EasyOCR reader initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing EasyOCR: {str(e)}")
            logger.error(traceback.format_exc())
            return {
                "isId": False,
                "nameMatch": False,
                "confidence": "none",
                "type": "Free Membership",
                "error": f"Error initializing text recognition: {str(e)}",
                "detectedText": {
                    "words": [],
                    "foundIdIndicators": [],
                    "foundNameParts": [],
                    "completeText": ""
                }
            }

        # Perform OCR with error handling
        try:
            logger.info("Starting OCR processing...")
            ocr_results = reader.readtext(
                image_cv,
                paragraph=False,  # Process individual words
                batch_size=4,     # Reduce memory usage
                width_ths=0.7,    # Adjust threshold for text grouping
                mag_ratio=1.5     # Magnification ratio
            )
            logger.info(f"OCR completed. Found {len(ocr_results)} text regions")

            # Clear memory
            del image_cv
            resized_img.close()

        except Exception as e:
            logger.error(f"Error during OCR processing: {str(e)}")
            logger.error(traceback.format_exc())
            return {
                "isId": False,
                "nameMatch": False,
                "confidence": "none",
                "type": "Free Membership",
                "error": f"Error during text recognition: {str(e)}",
                "detectedText": {
                    "words": [],
                    "foundIdIndicators": [],
                    "foundNameParts": [],
                    "completeText": ""
                }
            }

        # Process results
        words_found = []
        extracted_text = []

        for detection in ocr_results:
            if len(detection) >= 2:  # Ensure we have at least bbox and text
                bbox, text = detection[:2]
                confidence = detection[2] if len(detection) > 2 else 0.5  # Default confidence if not provided

                # Scale bounding box back to original image size if image was resized
                bbox_scaled = [[int(x / scale_ratio) for x in point] for point in bbox]
                words_found.append({
                    'text': text,
                    'confidence': round(float(confidence), 2),
                    'position': {
                        'top_left': bbox_scaled[0],
                        'top_right': bbox_scaled[1],
                        'bottom_right': bbox_scaled[2],
                        'bottom_left': bbox_scaled[3]
                    }
                })
                extracted_text.append(text)

        # Sort by confidence and join text
        words_found.sort(key=lambda x: x['confidence'], reverse=True)
        full_text = ' '.join(extracted_text)
        logger.info(f"Extracted text preview: {full_text[:200]}...")

        # Convert to lowercase for comparison
        extracted_text_lower = full_text.lower()
        full_name_lower = full_name.lower()

        # ID document indicators with common variations
        id_indicator_list = {
            'student_indicators': [
                'student', 'student id', 'student identity card',
                'student number', 'student name', 'student surname',
                'registration number', 'university', 'degree'
            ],
            'fullmember_indicators': [
                'certificate', 'artificial intelligence',
                'institution', 'university', 'education'
            ],
            'institutional_indicators': [
                'tin', 'trade name', 'authentication code',
                'certificate', 'business', 'company'
            ]
        }

        # Count indicators
        found_counts = {list_name: 0 for list_name in id_indicator_list}
        found_indicators = []

        for list_name, indicators in id_indicator_list.items():
            found = [
                indicator for indicator in indicators
                if indicator.lower() in extracted_text_lower
            ]
            found_counts[list_name] = len(found)
            found_indicators.extend(found)

        # Determine membership type
        max_list = max(found_counts.items(), key=lambda item: item[1])
        max_list_name, max_count = max_list

        is_id_document = max_count > 0
        logger.info(f"Document analysis - Found indicators: {found_indicators}")

        membership_type = "Free Membership"
        if is_id_document:
            if max_list_name == 'student_indicators':
                membership_type = "Student Member"
            elif max_list_name == 'fullmember_indicators':
                membership_type = "Full Member"
            elif max_list_name == 'institutional_indicators':
                membership_type = "Institutional Member"

        # Check name match
        name_found = full_name_lower in extracted_text_lower
        name_parts = full_name_lower.split()
        name_parts_found = all(part in extracted_text_lower for part in name_parts)
        found_name_parts = [part for part in name_parts if part in extracted_text_lower]

        logger.info(f"Name matching results - Full match: {name_found}, Parts found: {found_name_parts}")

        # Return structured result
        result = {
            "isId": bool(is_id_document),
            "nameMatch": bool(name_found or name_parts_found),
            "confidence": "high" if is_id_document and (name_found or name_parts_found) else "low",
            "type": membership_type,
            "detectedText": {
                "words": words_found,
                "foundIdIndicators": found_indicators,
                "foundNameParts": found_name_parts,
                "completeText": full_text
            }
        }

        logger.info("Document verification completed successfully")
        return result

    except Exception as e:
        logger.error(f"Unexpected error in verify_document: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "error": str(e),
            "isId": False,
            "nameMatch": False,
            "confidence": "none",
            "type": "Free Membership",
            "detectedText": {
                "words": [],
                "foundIdIndicators": [],
                "foundNameParts": [],
                "completeText": ""
            }
        }

if __name__ == "__main__":
    try:
        if len(sys.argv) != 4 or sys.argv[1] != "verify_document":
            error_result = {
                "error": "Invalid arguments",
                "isId": False,
                "nameMatch": False,
                "confidence": "none",
                "type": "Free Membership",
                "detectedText": {
                    "words": [],
                    "foundIdIndicators": [],
                    "foundNameParts": [],
                    "completeText": ""
                }
            }
            print(json.dumps(error_result))
            sys.exit(1)

        image_path = sys.argv[2]
        full_name = sys.argv[3]

        logger.info(f"Starting document verification with args: {sys.argv}")
        result = verify_document(image_path, full_name)
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
        logger.error(traceback.format_exc())
        error_result = {
            "error": str(e),
            "isId": False,
            "nameMatch": False,
            "confidence": "none",
            "type": "Free Membership",
            "detectedText": {
                "words": [],
                "foundIdIndicators": [],
                "foundNameParts": [],
                "completeText": ""
            }
        }
        print(json.dumps(error_result))
        sys.exit(1)