# Use the official Python image as a base image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy all necessary files into the container
COPY app.py .
COPY chatbot.py .
COPY train.py .
COPY intents.json .
COPY requirements.txt .
COPY templates/ ./templates     
COPY static/ ./static           
COPY chatbot_model.h5 .        
COPY classes.pkl .              
COPY words.pkl .                

# Install production dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run the application with Gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
